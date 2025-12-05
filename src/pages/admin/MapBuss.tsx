import { Bus, MapPin, Navigation, Pointer, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Map, { Layer, type MapRef, Marker, NavigationControl, Source } from "react-map-gl/mapbox";
import { Button } from "../../components/uiItem/button.tsx";
import { Card } from '../../components/uiItem/card.tsx';
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../contexts/apiConetxt.tsx";
import { useSocketIo } from "../../hooks/useSocketIo.ts";
import { toast } from "sonner";
import type { BusInfo, DriverData, RouteInfo, StopPointTrip } from "../../api/data-contracts.ts";
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

interface TripInfo {
    scheduleId: string;
    tripId: string;
    sattus: "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
    route: RouteInfo;
    bus: BusInfo;
    driver: DriverData;
    stops: StopPointTrip[];
}

interface BusLocation {
    tripId: string;
    position: [number, number];
    lastPos: [number, number];
}

export const Buss: React.FC = () => {

    const [selectedTrip, setSelectedTrip] = useState<TripInfo | null>(null);
    const [viewState, setViewState] = useState({
        latitude: 10.7599171,
        longitude: 106.6796834,
        zoom: 13.5,
    });

    const mapRef = useRef<MapRef>(null);

    const { api } = useApi();
    const { socket, connected } = useSocketIo();

    const { data: tripInfos, isLoading } = useQuery({
        queryKey: ['all-trip-today'],
        queryFn: async () => {
            const response = await api.getAllTripsForToday();
            const data = response.data.data?.data || [];
            // sort by status: ONGOING -> SCHEDULED -> CANCELLED
            return data;
        },
        placeholderData: [],
    })
    const [tripFilted, setTripFilted] = useState<(typeof tripInfos)>([]);

    const [busLocations, setBusLocations] = useState<BusLocation[]>([]);

    const { data: route } = useQuery({
        queryKey: ['route', selectedTrip?.route.id],
        queryFn: async () => {
            if (!selectedTrip) return null;
            console.log('fetching route for', selectedTrip.route.id);
            const response = await api.getRouteById(selectedTrip.route.id);

            const data = response.data.data;
            if (!data) {
                toast.error('Không tìm thấy thông tin tuyến đường.');
                return null;
            }
            return {
                ...data,
                metadata: {
                    ...data.metadata,
                    encodedPath: data.metadata.encodedPath ? JSON.parse(data.metadata.encodedPath) : [[], []],
                }
            }


        },
        enabled: !!selectedTrip,
    })

    useEffect(() => {

        if (!connected || !socket) return;

        const handleBusLocationUpdate = (data: {
            lat: number;
            lng: number;
        }, tripId: string) => {
            setBusLocations((prevLocations) => {
                const existingIndex = prevLocations.findIndex((loc) => loc.tripId === tripId);
                if (existingIndex !== -1) {
                    // Cập nhật vị trí hiện tại và lưu vị trí trước đó
                    const updatedLocations = [...prevLocations];
                    const existingLocation = updatedLocations[existingIndex];
                    updatedLocations[existingIndex] = {
                        tripId,
                        position: [data.lat, data.lng],
                        lastPos: existingLocation.position,
                    };
                    return updatedLocations;
                } else {
                    // Thêm vị trí mới
                    return [
                        ...prevLocations,
                        {
                            tripId,
                            position: [data.lat, data.lng],
                            lastPos: [data.lat, data.lng], // Khởi tạo lastPos giống position ban đầu
                        },
                    ];
                }
            });
        };

        socket.on('LiveLocationUpdate', handleBusLocationUpdate);

        return () => {
            socket.off('LiveLocationUpdate', handleBusLocationUpdate);
        };

    }, [connected, socket]);

    useEffect(() => {
        if (!tripInfos || !connected || !socket) return;

        // Join trip rooms for all trips today
        tripInfos.forEach((trip: any) => {
            socket.emit('joinTripRoom', trip.tripId);
        });
    }, [tripInfos, connected, socket]);

    useEffect(() => {
        // sort tripInfos by status: ONGOING -> SCHEDULED -> CANCELLED
        // and set to tripFilted
        if (!tripInfos) return;
        const sortedTrips = [...tripInfos].sort((a, b) => {
            const statusOrder: Record<string, number> = {
                'ONGOING': 1,
                'SCHEDULED': 2,
                'CANCELLED': 3,
            };
            return statusOrder[a.sattus] - statusOrder[b.sattus];
        });
        setTripFilted(sortedTrips);
    }, [tripInfos]);

    return (
        <div className="flex flex-col bg-[#F0F4F8] w-full h-screen overflow-hidden">
            <div className="flex-1 flex flex-col xl:flex-row gap-5 p-5 xl:p-7 h-full">
                {/* Bản đồ */}
                <Card className="xl:w-2/3 w-full h-full min-h-[500px] p-0 overflow-hidden">
                    <div className="p-5 pb-3">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-700" />
                            <span className="font-semibold text-xl">Bản đồ theo dõi vị trí xe Bus</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Khu vực TP. Hồ Chí Minh • Tổng số xe: {
                            tripInfos ? tripInfos.length : 0
                        }</div>
                    </div>

                    <div className="h-[calc(100%-80px)] rounded-lg overflow-hidden">
                        <Map
                            {...viewState}
                            ref={mapRef}
                            onMove={(evt) => setViewState(evt.viewState)}
                            mapboxAccessToken={MAPBOX_TOKEN}
                            mapStyle="mapbox://styles/mapbox/streets-v9"
                            style={{ width: "100%", height: "100%" }}
                        >
                            <NavigationControl position="top-right" />
                            {
                                // draw route polyline if route is selected
                            }
                            <Source id="route-line" type="geojson" data={{
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'LineString',
                                    coordinates: (() => {
                                        if (!route || !route.metadata.encodedPath) return [];
                                        const encodedPath = route.metadata.encodedPath;

                                        if (selectedTrip?.tripId.endsWith('DISPATCH')) {
                                            return encodedPath[0];
                                        }
                                        return encodedPath[1];
                                    })(),
                                },
                            }}>
                                <Layer
                                    id="route-layer"
                                    type="line"
                                    layout={{
                                        'line-join': 'round',
                                        'line-cap': 'round',
                                    }}
                                    paint={{
                                        'line-color': '#FF0000',
                                        'line-width': 5,
                                    }}
                                />
                            </Source>

                            {/* Render selected trip stops */}
                            <Source id="stops" type="geojson" data={{
                                type: 'FeatureCollection',
                                features: selectedTrip ? selectedTrip.stops.map((stop) => ({
                                    type: 'Feature',
                                    properties: {
                                        description: stop.name,
                                    },
                                    geometry: {
                                        type: 'Point',
                                        coordinates: stop.location
                                    },
                                })) : [],
                            }}>
                                <Layer
                                    id="stops-layer"
                                    type="circle"
                                    paint={{
                                        'circle-radius': 6,
                                        'circle-color': '#007cbf',
                                        'circle-stroke-width': 2,
                                        'circle-stroke-color': '#ffffff',
                                    }}
                                />
                            </Source>


                            {/* BUS MARKERS */}
                            {busLocations.map((bus) => {
                                const tripInfo = tripInfos?.find((trip: any) => trip.tripId === bus.tripId);
                                let markerColor = 'blue';
                                if (tripInfo) {
                                    if (tripInfo.sattus === 'ONGOING') markerColor = 'green';
                                    else if (tripInfo.sattus === 'CANCELLED') markerColor = 'red';
                                }

                                return (
                                    <Marker
                                        key={bus.tripId}
                                        longitude={bus.position[0]}
                                        latitude={bus.position[1]}
                                        anchor="center"
                                        onClick={(e) => {
                                            e.originalEvent.stopPropagation();
                                            console.log('bus clicked', tripInfos);
                                            setSelectedTrip(tripInfo || null);
                                            console.log('selectedBus', tripInfo);
                                        }}
                                    >
                                        <MapPin
                                            className="w-8 h-8 transition-transform transform -translate-y-3"
                                            style={{ color: markerColor }}
                                        />
                                    </Marker>
                                );
                            })}

                            {/* STATUS LEGEND */}
                            <div className="absolute bottom-4 right-4 bg-white shadow-lg rounded-lg px-4 py-3 text-sm flex flex-col gap-2 z-50">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span>Hoạt động</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span>Đang di chuyển</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span>Báo trễ</span>
                                </div>
                            </div>
                        </Map>
                    </div>

                </Card>

                {/* Panel chi tiết */}
                <div className="xl:w-1/3 max-h-[] h-full flex flex-col gap-4">
                    <input type="text" placeholder="Tìm kiếm chuyến xe..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white " />
                    {tripFilted ? (
                        <div className="overflow-y-auto h-full space-y-4">
                            {tripFilted.map((trip) => (
                                <Card key={trip.tripId} className="p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Bus className="w-6 h-6 text-gray-700" />
                                            <span className="font-semibold text-lg">Chuyến xe: {trip.tripId}</span>
                                        </div>
                                        {
                                            (() => {
                                                let colorClass = 'bg-blue-600 hover:bg-blue-700';


                                                if (trip.sattus === 'ONGOING') {
                                                    colorClass = 'bg-green-600 hover:bg-green-700';
                                                } else if (trip.sattus === 'CANCELLED') {
                                                    colorClass = 'bg-red-600 hover:bg-red-700';
                                                }

                                                return (
                                                    <Button size="sm" className={`${colorClass} text-white text-xs`} onClick={() => {
                                                        const busLocation = busLocations.find((bus) => bus.tripId === trip.tripId);
                                                        if (!busLocation) {
                                                            console.log('Chưa có dữ liệu vị trí cho chuyến xe này.');
                                                            toast.warning('Chưa có dữ liệu vị trí cho chuyến xe này.');
                                                        }

                                                        if (busLocation)
                                                            mapRef.current?.flyTo({
                                                                center: busLocation?.lastPos,
                                                                zoom: 15,
                                                            });
                                                        setSelectedTrip(trip);
                                                    }}>
                                                        {trip.sattus}
                                                    </Button>
                                                );
                                            })()
                                        }
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        Tuyến: {trip.route.name}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        Lái xe: {trip.driver.name} ({trip.driver.email})
                                    </div>
                                    <div className="text-sm text-gray-600">
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-8 text-center text-gray-500">
                            <Bus className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                            <p>
                                Chưa có chuyến xe bus nào trong ngày hôm nay.
                            </p>
                        </Card>
                    )}
                </div>
            </div >
        </div >
    );
}
