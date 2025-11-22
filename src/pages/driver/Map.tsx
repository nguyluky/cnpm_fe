import { MapPin } from "lucide-react";
import type { Marker as MarkeRef } from "mapbox-gl";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Marker, Source, type MapRef } from "react-map-gl/mapbox";
import { useApi } from "../../contexts/apiConetxt";
import { useParams } from "react-router";
import type { BusInfo } from "../../api/data-contracts";
import * as turf from '@turf/turf';


interface TripInfo {
    id: string;
    status: "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
    rotute: {
        id: string;
        name: string;
        path: [number, number][];
    };
    bus: BusInfo;
    stops: {
        id: string;
        name: string;
        location: number[];
        sequence: number;
        status: "PENDING" | "ARRIVED" | "DONE" | "SKIPPED";
    }[];
};

function splitRouteByPosition(coordinates: [number, number][], userLngLat: [number, number]) {
    const line = turf.lineString(coordinates);
    const userPoint = turf.point(userLngLat);

    // Tìm điểm chính xác trên đường (projection)
    const snappedPoint = turf.nearestPointOnLine(line, userPoint);

    // Slice phần đã đi từ điểm đầu đến snappedPoint
    const completed = turf.lineSlice(
        coordinates[0],
        snappedPoint.geometry.coordinates,
        line
    ).geometry.coordinates.map(coord => coord as [number, number]);

    // Slice phần còn lại từ snappedPoint đến cuối
    const remaining = turf.lineSlice(
        snappedPoint.geometry.coordinates,
        coordinates.slice(-1)[0],
        line
    ).geometry.coordinates.map(coord => coord as [number, number]);

    return { completed, remaining };
}


export function MapDriver() {
    const api = useApi()
    const { id } = useParams()
    const mapRef = useRef<MapRef>(null);
    const markerRef = useRef<MarkeRef>(null);
    const [tripInfo, setTripInfo] = useState<TripInfo>(null);
    const [userPos, setUserPos] = useState<[number, number]>([106.6297, 10.8231]);
    const forceToMarker = useRef(false);
    const [viewState, setViewState] = useState({
        longitude: 106.6297,
        latitude: 10.8231,
        zoom: 12
    });

    const [completedRoute, setCompletedRoute] = useState<[number, number][]>([]);
    const [remainingRoute, setRemainingRoute] = useState<[number, number][]>([]);


    useEffect(() => {
        if (!userPos) return;
        if (!tripInfo) return;
        // if (tripInfo.rotute.path.length > 2) return;

        const { completed, remaining } = splitRouteByPosition(tripInfo.rotute.path, userPos);
        console.log({ completed, remaining });

        setCompletedRoute(completed);
        setRemainingRoute(remaining);
    }, [userPos, tripInfo]);



    useEffect(() => {
        const callApi = async () => {
            const tripData = await api.api.getTripById(id!);
            if (tripData.status !== 200) {
                console.error("Failed to fetch trip data");
                return;
            }
            console.log(tripData.data.data);
            setTripInfo(tripData.data.data!);
            setUserPos(tripData.data.data!.rotute.path[0]);
        }

        callApi();

    }, [])


    useEffect(() => {
        console.log(navigator.geolocation.watchPosition);
        const watchId = navigator.geolocation.watchPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            setUserPos([longitude, latitude]);


            // update marker position
            if (markerRef.current) {
                // markerRef.current.flyTo([longitude, latitude], 1000);
                // markerRef.current.setLngLat([longitude, latitude]);
                setUserPos([longitude, latitude]);
            }

            if (mapRef.current && forceToMarker.current) {
                // how to move offset center 2/3 of the map width to the right
                // mapRef.current.easeTo({
                //     center: [longitude, latitude],
                //     duration: 1000
                // });
                const mapp = mapRef.current!;
                mapRef.current.easeTo({
                    center: [
                        longitude + (mapp.getBounds()!.getWest() - mapp.getBounds()!.getEast()) / 6,
                        latitude
                    ],
                    duration: 1000
                });
            }
        });

        return () => {
            navigator.geolocation.clearWatch(watchId);
        }
    }, []);


    const generateJsonStop = useMemo(() => {
        if (!tripInfo) return null;
        console.log("generating stop geojson");
        return {
            type: "FeatureCollection",
            features: tripInfo.stops.map(stop => ({
                id: `${stop.id}-stop`,
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: stop.location as [number, number]
                },
                properties: {
                    name: stop.name,
                    status: stop.status
                }
            }))
        }
    }, [tripInfo]);


    const listOfStops = useMemo(() => {
        return tripInfo?.stops.map((stop, idx, array) => (
            <li
                key={stop.id + "-stop-list" + idx}
                className="flex items-center justify-between bg-white/80 p-2 rounded-lg shadow-sm"
            >
                <div className="flex items-center">
                    <MapPin className="mr-3 text-sky-600" />
                    <div>
                        <p className="text-sm text-gray-800">{stop.name}</p>
                        <p className="text-xs text-gray-500">
                            {stop.location[1].toFixed(6)}, {stop.location[0].toFixed(6)}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <p className="text-gray-500 text-sm"> {
                        // calculate distance from current stop to next stop
                        (() => {
                            if (idx === array.length - 1) return "0 m";
                            const from = turf.point(stop.location as [number, number]);
                            const to = turf.point(array[idx + 1].location as [number, number]);
                            const options = { units: 'meters' as turf.Units };
                            const distance = turf.distance(from, to, options);
                            if (distance < 1000) {
                                return `${distance.toFixed(0)} m`;
                            } else {
                                return `${(distance / 1000).toFixed(2)} km`;
                            }
                        })()
                    } </p>
                </div>
            </li>
        ))
    }, [tripInfo?.stops])
    
    return (
        <div className="w-full h-screen relative">
            {
                // overlay header
            }

            <div className="absolute h-full w-1/4 z-10 top-0 left-0 p-4">
                <div className="w-full h-full flex flex-col bg-white/30 backdrop-blur-sm rounded-lg">
                    <header className="p-2">
                        <div className="w-full flex p-2 items-center bg-white/70 backdrop-blur-sm rounded-lg">
                            <button className="mr-4 p-2 backdrop-blur-sm rounded-lg hover:bg-white/50 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className="flex flex-col">
                                <p className="text-gray-600">Route</p>
                                <h1 className="text-xl truncate">{tripInfo?.rotute.name}</h1>
                            </div>

                            <div className="flex flex-row bg-red-100 px-4 py-2 rounded-lg ml-auto">
                                <p>ON GOING</p>
                            </div>
                        </div>
                    </header>

                    <main className="p-2 h-full overflow-hidden">
                        {/* navigation info */}
                        <div className="bg-white/80 p-3 rounded-lg mb-4 shadow-sm">
                            <h2 className="text-lg font-semibold mb-2">Navigation</h2>
                            <div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Current position</p>
                                        <p className="text-sm font-medium">
                                            {userPos[1].toFixed(6)}, {userPos[0].toFixed(6)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Nearest stop</p>
                                        <p className="text-sm font-medium">0000</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Distance to next</p>
                                        <p className="text-sm font-medium">99999</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Remaining</p>
                                        <p className="text-sm font-medium">99h99m</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        className="px-3 py-1 bg-sky-600 text-white rounded hover:opacity-90"
                                        onClick={() => {
                                            // setUserPos(nextStop);
                                            // setViewState({ longitude: nextStop[0], latitude: nextStop[1], zoom: 15 });
                                        }}
                                    >
                                        Go to next
                                    </button>

                                    <button
                                        className="px-3 py-1 bg-white border rounded"
                                        onClick={() => {
                                            // setViewState({ longitude: userPos[0], latitude: userPos[1], zoom: 15 })
                                            const longitude = userPos[0]
                                            const latitude = userPos[1]
                                            const mapp = mapRef.current!;
                                            mapRef.current?.easeTo({
                                                center: [
                                                    longitude + (mapp.getBounds()!.getWest() - mapp.getBounds()!.getEast()) / 4,
                                                    latitude
                                                ],
                                                duration: 1000
                                            })
                                            forceToMarker.current = true;
                                        }}
                                    >
                                        Center on me
                                    </button>

                                    <div className="ml-auto text-right">
                                        <p className="text-xs text-gray-500">ETA</p>
                                        <p className="text-sm font-medium">dddd</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* display stops */}
                        <div className="overflow-auto">
                            <ol className="space-y-2  p-2">
                                {
                                    listOfStops
                                }
                            </ol>
                        </div>


                    </main>

                    <footer className="p-2">
                        {
                            // info progress total distance
                        }
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 flex justify-between items-center">
                            <div className="flex flex-col">
                                <p className="text-gray-600 uppercase">progress</p>
                                <p className="text-2xl font-extrabold">2/5</p>
                            </div>

                            <div className="flex flex-col">
                                <p className="text-gray-600 uppercase">total distance</p>
                                <p className="text-2xl font-extrabold">5.2 km</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>

            <aside className="w-full h-full">
                <Map
                    ref={mapRef} // <--- Gắn ref vào Map
                    {...viewState}
                    onMove={evt => {
                        setViewState(evt.viewState)
                    }}
                    onDragStart={() => {
                        forceToMarker.current = false
                    }}
                    mapboxAccessToken="pk.eyJ1Ijoibmd1eWx1a3kxIiwiYSI6ImNtZ2Yxb2hoMjAzbW8yam9teHN1MGhiYXYifQ.5gyVRqeLYNO0lXUYIRgpJQ"
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                >
                    <Source id="completed" type="geojson" data={{
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: completedRoute
                        }
                    }}>
                        <Layer
                            id="completed-line"
                            type="line"
                            paint={{
                                "line-color": "#0f172a",      // màu tối
                                "line-width": 6
                            }}
                        />
                    </Source>
                    <Source id="remaining" type="geojson" data={{
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: remainingRoute
                        }
                    }}>
                        <Layer
                            id="remaining-line"
                            type="line"
                            paint={{
                                "line-color": "#3b82f6",       // màu sáng
                                "line-width": 6
                            }}
                        />
                    </Source>

                    {
                        // draw stops markers
                    }
                    <Source id="stops" type="geojson" data={generateJsonStop}>
                        <Layer
                            id="stops-layer"
                            type="circle"
                            paint={{
                                "circle-radius": 8,
                                "circle-color": [
                                    'match',
                                    ['get', 'status'],
                                    'PENDING', '#fbbf24',    // vàng
                                    'ARRIVED', '#3b82f6',    // xanh dương
                                    'DONE', '#10b981',       // xanh lá
                                    'SKIPPED', '#ef4444',    // đỏ
                                    '#6b7280'                // xám (mặc định)
                                ],
                                "circle-stroke-color": "#ffffff",
                                "circle-stroke-width": 2
                            }}
                        />
                    </Source>

                    {
                        // draw bus marker
                    }
                    <Marker
                        longitude={userPos[0]}
                        latitude={userPos[1]}
                        anchor="center"
                        ref={markerRef}
                    >
                        <div
                            style={{
                                width: "26px",
                                height: "26px",
                                background: "#0ea5e9",
                                borderRadius: "50%",
                                border: "3px solid white",
                                boxShadow: "0 0 6px rgba(0,0,0,0.4)",
                                // transform: `rotate(${heading}deg)`,
                                transition: "transform 0.1s linear",
                            }}
                        ></div>
                    </Marker>
                </Map>
            </aside>

        </div>
    )
}
