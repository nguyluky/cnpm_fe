
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as turf from '@turf/turf';
import { MapPin } from "lucide-react";
import type { Marker as MarkeRef } from "mapbox-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Marker, Source, type MapRef } from "react-map-gl/mapbox";
import type { GeoJsonProperties, Geometry, GeoJSON } from "geojson";
import { useParams } from "react-router";
import { useApi } from "../../contexts/apiConetxt";


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

function snapToRoute(coordinates: [number, number][], userLngLat: [number, number]) {
    const line = turf.lineString(coordinates);
    const userPoint = turf.point(userLngLat);

    // Tìm điểm chính xác trên đường (projection)
    const snappedPoint = turf.nearestPointOnLine(line, userPoint);

    return snappedPoint.geometry.coordinates as [number, number];
}


export function MapDriver() {
    const api = useApi()
    const queryClient = useQueryClient();

    const listOfStopsRef = useRef<HTMLOListElement>(null);
    const mapRef = useRef<MapRef>(null);
    const markerRef = useRef<MarkeRef>(null);
    const forceToMarker = useRef(false);
    const lastUserPos = useRef<[number, number] | null>(null);

    const { id } = useParams()
    const [userPos, setUserPos] = useState<[number, number]>([106.6297, 10.8231]);
    const [viewState, setViewState] = useState({
        longitude: 106.6297,
        latitude: 10.8231,
        zoom: 12
    });

    const [completedRoute, setCompletedRoute] = useState<[number, number][]>([]);
    const [remainingRoute, setRemainingRoute] = useState<[number, number][]>([]);

    const [nextStopIndex, setNextStopIndex] = useState<number | null>(null);

    const { data: tripInfo } = useQuery({
        queryKey: ['trip-info', id],
        queryFn: async () => {
            const tripData = await api.api.getTripById(id!);
            console.log("Fetched trip data:", tripData);
            if (tripData.data.data?.status === "ONGOING") {
                const nextStop = tripData.data.data.stops.findIndex((stop: any) => stop.status === "PENDING");
                setNextStopIndex(nextStop !== -1 ? nextStop : null);
            }
            return tripData.data.data!;
        },
    })


    const distanceToNextStop = useMemo(() => {
        // distance from userPos to next stop based on path
        // cut the route from userPos to next stop and calculate its length
        if (nextStopIndex === null) return null;
        if (!tripInfo) return null;
        const nextStop = tripInfo.stops[nextStopIndex];
        const line = turf.lineString(tripInfo.rotute.path);
        const userPoint = turf.point(userPos);
        const stopPoint = turf.point(nextStop.location as [number, number]);

        // Tìm điểm chính xác trên đường (projection)
        const snappedUserPoint = turf.nearestPointOnLine(line, userPoint);
        const snappedStopPoint = turf.nearestPointOnLine(line, stopPoint);

        const slicedLine = turf.lineSlice(
            snappedUserPoint.geometry.coordinates,
            snappedStopPoint.geometry.coordinates,
            line
        );

        const length = turf.length(slicedLine, { units: 'meters' });
        return length;
    }, [nextStopIndex, tripInfo, userPos]);

    const startTrip = useMutation({
        mutationFn: async () => {
            if (!tripInfo) return;
            const res = await api.api.startTrip(tripInfo.id);
            return res.data.data;
        },
        onSuccess: (data) => {
            setNextStopIndex(0);

            queryClient.setQueryData(['trip-info', id], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    status: data?.status
                };
            });
        }
    })

    const endTrip = useMutation({
        mutationFn: async () => {
            if (!tripInfo) return;
            const res = await api.api.endTrip(tripInfo.id);
            return res.data.data;
        },
        onSuccess: (data) => {

            queryClient.setQueryData(['trip-info', id], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    status: data?.status
                };
            });
        }
    })

    const updateTripPosition = useMutation({
        mutationFn: async (position: { longitude: number, latitude: number }) => {
            if (!tripInfo) return;
            const res = await api.api.updateTripLocation(tripInfo.id, position);
            return res.data.data;
        },
    })

    const markArriveStop = useMutation({
        mutationFn: async (stopId: string) => {
            if (!tripInfo) return;
            const res = await api.api.markStoppointAsArrived(tripInfo.id, stopId);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.setQueryData(['trip-info', id], (old: typeof tripInfo) => {
                if (!old) return old;

                const updatedStops = old.stops.map((stop) => {
                    if (stop.id === tripInfo?.stops[nextStopIndex!].id) {
                        return {
                            ...stop,
                            status: "ARRIVED"
                        };
                    }
                    return stop;
                });
                return {
                    ...old,
                    stops: updatedStops
                };
            });
        }
    })

    const markCompleteStop = useMutation({
        mutationFn: async (stopId: string) => {
            if (!tripInfo) return;
            const res = await api.api.markStoppointAsDeparted(tripInfo.id, stopId);
            return res.data.data;
        },

        onSuccess: (data) => {
            setNextStopIndex(prev => {
                if (prev === null) return null;
                return prev + 1;
            });
            queryClient.setQueryData(['trip-info', id], (old: any) => {
                if (!old) return old;
                const updatedStops = old.stops.map((stop: any) => {
                    if (stop.id === data?.stopId) {
                        return {
                            ...stop,
                            status: "DONE"
                        };
                    }
                    return stop;
                });
                return {
                    ...old,
                    stops: updatedStops
                };
            });
        }
    })

    // update completed and remaining route when userPos or tripInfo changes
    // send user position to server
    useEffect(() => {
        if (!userPos) return;
        if (!tripInfo) return;

        const { completed, remaining } = splitRouteByPosition(tripInfo.rotute.path, userPos);

        const [longitude, latitude] = userPos;

        const lastPos = lastUserPos.current;
        if (lastPos) {
            if (turf.distance(turf.point(lastPos), turf.point([longitude, latitude]), { units: 'meters' }) > 5) {
                lastUserPos.current = [longitude, latitude];
                if (tripInfo.status === "ONGOING" && updateTripPosition.status !== "pending")
                    updateTripPosition.mutate({ longitude: userPos[0], latitude: userPos[1] });
            }
        } {
            lastUserPos.current = [longitude, latitude];
        }

        setCompletedRoute(completed);
        setRemainingRoute(remaining);
    }, [userPos, tripInfo]);

    // watch user position
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition((pos) => {
            let { latitude, longitude } = pos.coords;
            // snap to route
            if (tripInfo) {
                const snappedPos = snapToRoute(tripInfo.rotute.path, [longitude, latitude]);
                longitude = snappedPos[0];
                latitude = snappedPos[1];
            }


            let heading: number | null = null;
            if (lastUserPos.current) {
                const lastPos = lastUserPos.current;
                const deltaLng = longitude - lastPos[0];
                const deltaLat = latitude - lastPos[1];
                heading = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI);
                if (heading < 0) heading += 360;

                // cal distance from last position
            }

            setUserPos([longitude, latitude]);

            if (mapRef.current && forceToMarker.current) {

                // get position of point add 1/2 of map hight and 2/3 of map width to the left-top
                const mapp = mapRef.current!;
                const cavans = mapp.getCanvas();
                const w = cavans.width;
                const h = cavans.height;
                const targetPixel: [number, number] = [w * 1.5 / 4, h * 1 / 2];

                const targetLngLat = mapp.unproject(targetPixel);
                const center = mapp.getCenter();

                const offsetLng: [number, number] = [
                    center.lng - targetLngLat.lng,
                    center.lat - targetLngLat.lat
                ]

                mapp.easeTo({
                    center: [
                        longitude - offsetLng[0],
                        latitude - offsetLng[1]
                    ],
                    bearing: heading !== null ? heading : mapp.getBearing(),
                    pitch: 45,
                    zoom: Math.max(mapp.getZoom(), 15),
                    duration: 1000
                });
            }
        });

        return () => {
            navigator.geolocation.clearWatch(watchId);
        }
    }, [tripInfo]);


    useEffect(() => {
        // if (!tripInfo) return;
        //
        // const startTime = new Date(tripInfo.rotute.startTime);
        // const now = new Date();
        //
        // if (tripInfo.status === "PLANNED") {
        //     setSidebarState("CONFIG_START");
        // }
    }, [tripInfo])


    const generateJsonStop: GeoJSON<Geometry, GeoJsonProperties> = useMemo(() => {
        if (!tripInfo) return {
            type: "FeatureCollection",
            features: []
        };
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
                    status: (nextStopIndex !== null && tripInfo.stops[nextStopIndex].id === stop.id) ? "NEXT" : stop.status,
                }
            }))
        }
    }, [nextStopIndex, tripInfo]);


    const listOfStops = useMemo(() => {
        if (!tripInfo) return [];
        return tripInfo.stops.map((stop, idx, array) => (
            {
                data: stop,
                distanceToNext: (() => {
                    if (idx === array.length - 1) return 0;
                    const from = turf.point(stop.location as [number, number]);
                    const to = turf.point(array[idx + 1].location as [number, number]);
                    const options = { units: 'meters' as turf.Units };
                    const distance = turf.distance(from, to, options);
                    return distance;
                })()
            }
        ))
    }, [tripInfo])

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
                                <h1 className="text-xl text-ellipsis">{tripInfo?.rotute.name}</h1>
                            </div>

                            <div className="flex flex-row bg-red-100 px-4 py-2 rounded-lg ml-auto">
                                <p>{
                                    tripInfo ? tripInfo.status : "N/A"
                                }</p>
                            </div>
                        </div>
                    </header>

                    <main className="p-2 h-full overflow-hidden flex flex-col">
                        {/* navigation info */}
                        <div className="bg-white/80 p-3 rounded-lg mb-4 shadow-sm">
                            <h2 className="text-lg font-semibold mb-2">Navigation</h2>
                            <div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Current position</p>
                                        <p className="text-sm font-medium">
                                            {userPos[1].toFixed(6)}, <br /> {userPos[0].toFixed(6)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Next stop</p>
                                        <p className="text-sm font-medium">{
                                            nextStopIndex !== null && tripInfo ?
                                                tripInfo.stops[nextStopIndex].name : "N/A"
                                        }</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Distance to next</p>
                                        <p className="text-sm font-medium">{
                                            distanceToNextStop !== null ? distanceToNextStop.toFixed(0) + " m" : "N/A"
                                        }</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Remaining</p>
                                        <p className="text-sm font-medium">
                                            {nextStopIndex || "N/A"} / {tripInfo?.stops.length}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {
                                        // <button
                                        //     className="px-3 py-1 bg-sky-600 text-white rounded hover:opacity-90"
                                        //     onClick={() => {
                                        //
                                        //     }}
                                        // >
                                        //     Go to next
                                        // </button>
                                    }
                                    <button
                                        className="bg-sky-600 px-3 py-1 text-white rounded  hover:opacity-90"
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

                                    {
                                        // <div className="ml-auto text-right">
                                        //     <p className="text-xs text-gray-500">ETA</p>
                                        //     <p className="text-sm font-medium">dddd</p>
                                        // </div>
                                    }

                                </div>
                            </div>
                        </div>
                        {/* display stops */}
                        <div className="overflow-auto h-auto">
                            <ol className="space-y-2 p-2" ref={listOfStopsRef}>
                                {
                                    listOfStops.map(({
                                        data: stop,
                                        distanceToNext
                                    }, idx) => (
                                        <li
                                            key={stop.id + "-stop-list" + idx}
                                            className={"flex items-center justify-between bg-white/80 p-2 rounded-lg shadow-sm " + (nextStopIndex === idx ? "border-2 border-sky-600" : "")}
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
                                                    distanceToNext > 0 ?
                                                        (() => {
                                                            if (distanceToNext < 1000) {
                                                                return `${distanceToNext.toFixed(0)} m`;
                                                            }
                                                            else {
                                                                return `${(distanceToNext / 1000).toFixed(2)} km`;
                                                            }
                                                        })()
                                                        :
                                                        "=))"
                                                } </p>
                                            </div>
                                        </li>
                                    ))


                                }
                            </ol>
                        </div>


                    </main>

                    <footer className="p-2">
                        {
                            // info of the trip
                            // next stop, distance to next stop, start time, number of stops
                        }
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2">
                            <div className="w-full flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Next stop</p>
                                    <h2 className="text-lg font-semibold">
                                        {
                                            nextStopIndex !== null && tripInfo ?
                                                tripInfo.stops[nextStopIndex].name
                                                :
                                                "N/A"
                                        }
                                    </h2>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Distance to next</p>
                                    <h2 className="text-lg font-semibold">
                                        {
                                            distanceToNextStop !== null ?
                                                `${distanceToNextStop.toFixed(0)} m`
                                                :
                                                "N/A"
                                        }
                                    </h2>
                                </div>
                            </div>

                            {
                                (() => {

                                    if (tripInfo?.status === "PLANNED") {
                                        return <button className="px-4 w-full py-2 bg-red-600 text-white rounded-lg hover:opacity-90" onClick={() => {
                                            startTrip.mutate();
                                            console.log("Start trip");
                                        }}>
                                            {
                                                startTrip.status === "pending" ? "Starting..." : "Bắt đầu chuyến đi"
                                            }
                                        </button>
                                    } else if (tripInfo?.status === "ONGOING") {
                                        if (nextStopIndex !== null && tripInfo && tripInfo.stops[nextStopIndex].status === "ARRIVED") {
                                            return <button className="px-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:opacity-90" onClick={() => {
                                                if (nextStopIndex === null || !tripInfo) return;
                                                const nextStop = tripInfo.stops[nextStopIndex];
                                                markCompleteStop.mutate(nextStop.id);
                                            }} disabled={markCompleteStop.status === "pending"}>
                                                {markCompleteStop.status === "pending" ? "Đang xử lý..." : "Rời khỏi điểm dừng"}
                                            </button>
                                        }
                                        else if (distanceToNextStop !== null && distanceToNextStop < 100) {
                                            return <button className="px-4 w-full py-2 bg-green-600 text-white rounded-lg hover:opacity-90" onClick={() => {
                                                if (nextStopIndex === null || !tripInfo) return;
                                                const nextStop = tripInfo.stops[nextStopIndex];
                                                markArriveStop.mutate(nextStop.id);
                                                console.log("Arrived at stop:", nextStop.name);
                                            }} disabled={markArriveStop.status === "pending"}>
                                                {
                                                    markArriveStop.status === "pending" ? "Đang xử lý..." : "Đã đến điểm dừng"
                                                }
                                            </button>
                                        }
                                        else if (nextStopIndex === tripInfo.stops.length - 1 && tripInfo.stops[nextStopIndex].status === "DONE") {
                                            return <button className="px-4 w-full py-2 bg-red-600 text-white rounded-lg hover:opacity-90" onClick={() => {
                                                endTrip.mutate();
                                                console.log("End trip");
                                            }} disabled={endTrip.status === "pending"}>
                                                {endTrip.status === "pending" ? "Kết thúc..." : "Kết thúc chuyến đi"}
                                            </button>
                                        }
                                        else {
                                            return <button className="px-4 w-full py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed" disabled>
                                                Đang di chuyển...
                                            </button>
                                        }

                                    }

                                })()
                            }
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
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: completedRoute
                        }
                    }}>
                        <Layer
                            id="completed-line"
                            type="line"
                            layout={{
                                'line-join': 'round',
                                'line-cap': 'round',
                            }}
                            paint={{
                                "line-color": "#0f172a",      // màu tối
                                "line-width": 6
                            }}
                        />
                    </Source>
                    <Source id="remaining" type="geojson" data={{
                        type: 'Feature',
                        properties: {},
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
                    <Source id="stops" type="geojson" data={generateJsonStop!}>
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
                                    'NEXT', '#8b5cf6',       // tím
                                    '#6b7280',               // xám (mặc định)
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
                        {
                            // add heading arrow
                        }
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
