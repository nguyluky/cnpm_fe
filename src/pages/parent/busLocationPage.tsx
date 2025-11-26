/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronUp, LocateIcon, LocateOff, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Map, { Layer, type MapRef, Marker, Source } from "react-map-gl/mapbox";
import { useApi } from "../../contexts/apiConetxt";

import { useQuery } from "@tanstack/react-query";
import { useSocketIo } from "../../hooks/useSocketIo";

interface Student {
    id: string;
    name: string;

    meta: any;
}

export function BusLocationPage() {
    const api = useApi();
    const mapRef = useRef<MapRef>(null);
    const { socket, connected } = useSocketIo();
    const [viewState, setViewState] = useState({
        longitude: 106.660172,
        latitude: 10.762622,
        zoom: 12
    });
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [showStudentList, setShowStudentList] = useState(false);
    const [busLocation, setBusLocation] = useState<{ lat: number; lng: number } | null>(null);
    const focusedToMarker = useRef(false);

    const { data: students } = useQuery({
        queryKey: ['student-info'],
        queryFn: async () => {
            const response = await api.api.getStudentsForParent();
            console.log(response.data.data?.data);
            setSelectedStudent(response.data.data?.data[0] || null);
            return response.data.data?.data;
        },
    });

    const { data: selectedStudentId } = useQuery({
        queryKey: ['selected-student-id', selectedStudent?.id],
        queryFn: async () => {
            const response = await api.api.getStudentInfoForParent(selectedStudent?.id || '');
            return response.data.data;
        },
    });

    // how to stop refetching where 404
    const { data: tripData } = useQuery({
        queryKey: ['trip-info', selectedStudent?.id],
        queryFn: async () => {
            if (!selectedStudent) return null;
            const response = await api.api.getTodaysTripForStudent(selectedStudent.id);

            return response.data.data;
        },
        retry: (failureCount, error) => {
            // Stop retrying on 404 errors
            if ((error as any).status == 404) return false;
            return failureCount < 3;
        },
    })

    useEffect(() => {
        // center path on map
        if (tripData?.route?.path && tripData.route.path.length > 0) {
            const coordinates = tripData.route.path;
            const lons = coordinates.map(coord => coord[0]);
            const lats = coordinates.map(coord => coord[1]);
            const minLon = Math.min(...lons);
            const maxLon = Math.max(...lons);
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);

            mapRef.current?.fitBounds(
                [
                    [minLon, minLat],
                    [maxLon, maxLat]
                ],
                { padding: 40 }
            );
        }
    }, [tripData]);

    useEffect(() => {
        console.log('Socket connected:', socket, connected);
        if (!socket || !tripData?.tripId || !connected) return;
        console.log('Joining trip room:', tripData.tripId);

        socket.emit('joinTripRoom', tripData?.tripId || '');

        const handleTripUpdate = ({ lat, lng }: { lat: number; lng: number; }) => {
            setBusLocation({ lat, lng });
            if (focusedToMarker.current) {
                mapRef.current?.flyTo({
                    center: [lng, lat],
                    essential: true
                });
            }
        };

        socket.on('LiveLocationUpdate', handleTripUpdate);

        return () => {
            socket.off('UpdateLocation', handleTripUpdate);
        };

    }, [tripData?.tripId, socket, connected]);

    return <>
        <Map
            ref={mapRef} // <--- Gắn ref vào Map
            {...viewState}
            mapboxAccessToken="pk.eyJ1Ijoibmd1eWx1a3kxIiwiYSI6ImNtZ2Yxb2hoMjAzbW8yam9teHN1MGhiYXYifQ.5gyVRqeLYNO0lXUYIRgpJQ"
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onMove={evt => {
                setViewState(evt.viewState)
            }}
            onDrag={() => {
                focusedToMarker.current = false;
            }}
        >
            {
                // drawn path of bus
            }
            <Source id="route" type="geojson" data={
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": tripData ? tripData.route.path || [] : []
                    }
                }
            }>
                <Layer
                    id="route-layer"
                    type="line"
                    paint={{
                        "line-color": "#007cbf",
                        "line-width": 6
                    }}
                />
            </Source>

            {
                busLocation && (
                    <Marker
                        longitude={busLocation.lng}
                        latitude={busLocation.lat}
                        anchor="center"
                    >
                        <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                            {
                                // bus icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v3a2 2 0 002 2h1v3H4a2 2 0 00-2 2v1a1 1 0 001 1h1a3 3 0 006 0h4a3 3 0 006 0h1a1 1 0 001-1v-1a2 2 0 00-2-2h-1v-3h1a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zm0 2h8v2H6V4zm0 4h8v3H6V8zm0 5h8v3H6v-3z" />
                                </svg>
                            }
                        </div>
                    </Marker>
                )
            }


            {
                // bus stops markers
            }
            <Source id="stops" type="geojson" data={
                {
                    type: "Feature",
                    properties: {
                        name: tripData?.stopPoint.stopName || ''
                    },
                    geometry: {
                        type: "Point",
                        coordinates: tripData ? [tripData.stopPoint.pos[1], tripData.stopPoint.pos[0]] : [0, 0]
                    },
                }
            }>
                <Layer
                    id="stops-layer"
                    type="circle"
                    paint={{
                        "circle-radius": 8,
                        "circle-color": "#FF0000",
                        "circle-stroke-width": 2,
                        "circle-stroke-color": "#FFFFFF"
                    }}
                />
            </Source>

            {

                // <NavigationControl style={{
                //     marginTop: 90,
                //     marginLeft: 10
                // }} 
                // />
            }
        </Map>

        {
            // center to bus location button
        }
        <div className="absolute top-20 right-4 bg-white bg-opacity-90 rounded-full shadow-lg p-2 cursor-pointer hover:bg-blue-500 hover:text-white transition"
            onClick={() => {
                if (busLocation) {
                    mapRef.current?.flyTo({
                        center: [busLocation.lng, busLocation.lat],
                        zoom: 15,
                        essential: true
                    });
                    focusedToMarker.current = true;
                }
            }}
        >
            {
                busLocation ? (
                    <LocateIcon className="w-6 h-6" />
                ) : (

                    <LocateOff className="w-6 h-6" />
                )
            }
        </div>

        {
            // student info overlay
        }
        <div className="absolute z-10 flex bottom-19 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 rounded-lg shadow-lg py-2 px-3 w-11/12 max-w-md">
            <div className="relative w-full" >
                <div className="flex items-center space-x-4">
                    <img
                        src="https://avatar.iran.liara.run/public"
                        alt="Student Avatar"
                        className="w-16 h-16 rounded-full border-2 border-blue-500"
                    />
                    <div>
                        <h2 className="text-sm font-semibold text-gray-800">
                            {selectedStudent?.name}
                        </h2>
                        <p className="text-xs text-gray-600">
                            Age: {selectedStudent?.meta?.age}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                            Status: {tripData ? (() => {
                                if (!selectedStudentId?.assignment.pickupStop) {
                                    return "On Going to School";
                                }
                                return "Pending Pickup";
                            })() : 'No trip today'}
                        </p>
                    </div>
                </div>

                {
                    // arrow showing more student
                }
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2" onClick={() => setShowStudentList(!showStudentList)}>
                    <ChevronUp className="w-6 h-6 text-gray-500" />
                </div>
            </div>
            {
                (showStudentList && students) &&
                <div className="absolute bottom-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                    {students.map((student) => (
                        <div
                            key={student.id}
                            className="flex items-center space-x-4 p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                setSelectedStudent(student);
                                setShowStudentList(false);
                            }}
                        >
                            <img
                                src="https://avatar.iran.liara.run/public"
                                alt="Student Avatar"
                                className="w-10 h-10 rounded-full border-2 border-blue-500"
                            />
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800">
                                    {student.name}
                                </h3>
                                <p className="text-xs text-gray-600">
                                    Age: {student.meta.age}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            }

        </div>
        {
            // search bar
        }
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-white bg-opacity-90 rounded-lg shadow-lg flex 
                    items-center
                    border border-slate-300
                    focus-within:border-blue-500

                    ">
            <input
                type="text"
                placeholder="Search for routes, stops..."
                className="w-full py-2 rounded-lg outline-none px-4 bg-transparent text-gray-700"
            />
            <Search className="w-6 h-6 text-gray-500 m-2" />
        </div>
    </>
}
