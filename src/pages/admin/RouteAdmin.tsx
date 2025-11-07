import { Card } from '../../components/uiItem/card.tsx';
import { Button } from '../../components/uiItem/button.tsx';
import { MapPin, Bell } from "lucide-react";
import Map, { Layer, NavigationControl, Source, Popup, Marker } from "react-map-gl/mapbox";
import { useEffect, useState } from "react";
const MAPBOX_TOKEN = "pk.eyJ1Ijoibmd1eWx1a3kxIiwiYSI6ImNtZ2Yxb2hoMjAzbW8yam9teHN1MGhiYXYifQ.5gyVRqeLYNO0lXUYIRgpJQ";
import { Bus, AlertTriangle, User, Route, Clock } from "lucide-react";
import type { RouteData, StopPointsData } from '../../api/data-contracts.ts';
import { useApi } from '../../contexts/apiConetxt.tsx';

const busLocation = [106.698, 10.771]; // Vị trí xe bus

export const RouteAdmin: React.FC = () => {
    const { api } = useApi();
    const [stopPoints] = useState<StopPointsData[]>([]);
    const [selectedRoute] = useState<RouteData | null>(null);
    const [allRoutes] = useState<RouteData[]>([]);

    const [viewState, setViewState] = useState({
        latitude: 10.771,
        longitude: 106.698,
        zoom: 14,
    });

    useEffect(() => {

        const processData = async () => {
            api.getAllRoutes().then((routes) => {
                console.log("Routes:", routes);
            });
        }
        processData();

    }, []);

    return (
        <div className="flex flex-col bg-[#E0E7FF] w-full h-screen overflow-hidden">
            <div className="flex-1 mx-7 my-5 flex flex-col xl:flex-row gap-5 overflow-hidden">
                {/* Left Column - Danh sách tuyến */}
                <Card className="xl:w-96 w-full h-fit xl:h-full overflow-y-auto p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Quản lý tuyến đường</h2>
                        <Button className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded-lg">
                            + Tạo tuyến mới
                        </Button>
                    </div>
                    <p className="text-sm text-gray-600">Tạo và quản lý các tuyến đường xe Bus</p>

                    <div className="flex flex-col gap-3">
                        {
                            // {mockRoutes.map((route) => (
                            //     <Card
                            //         key={route.id}
                            //         className={`p-4 rounded-xl border ${selectedRoute?.id === route.id ? "border-[#6366F1]" : "border-gray-200"
                            //             } bg-white cursor-pointer hover:shadow-sm transition-shadow`}
                            //     >
                            //         <div className="flex justify-between items-start mb-2">
                            //             <div>
                            //                 <h3 className="font-semibold text-base">
                            //                     Tuyến {route.id} - {route.district}
                            //                 </h3>
                            //                 <p className="text-sm text-gray-600">{route.name}</p>
                            //             </div>
                            //             <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                            //                 Hoạt động
                            //             </span>
                            //         </div>
                            //
                            //         {/* flex-col để hiển thị theo chiều dọc */}
                            //         <div className="flex flex-col gap-2 text-sm text-gray-600">
                            //             <span className="flex items-center gap-1">
                            //                 <MapPin size={16} />
                            //                 {route.distance}
                            //             </span>
                            //
                            //             <span className="flex items-center gap-1">
                            //                 <Clock size={16} />
                            //                 {route.time}
                            //             </span>
                            //
                            //             <span className="flex items-center gap-1">
                            //                 <User size={16} />
                            //                 {route.name}
                            //             </span>
                            //         </div>
                            //     </Card>
                            //
                            // ))}
                        }
                    </div>
                </Card>

                {/* Right Column - Bản đồ + Thông tin */}
                <div className="flex-1 flex flex-col gap-5">
                    {/* Bản đồ */}
                    <Card className="flex-1 min-h-96">
                        <div className="p-5 h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5" />
                                <span className="font-semibold text-xl">Tuyến 1 - Quận 1</span>
                            </div>

                            <div className="flex-1 rounded-lg overflow-hidden relative">
                                <Map
                                    {...viewState}
                                    onMove={(evt) => setViewState(evt.viewState)}
                                    mapboxAccessToken={MAPBOX_TOKEN}
                                    mapStyle="mapbox://styles/mapbox/streets-v9"
                                    style={{ width: "100%", height: "100%" }}
                                >
                                    {/* Vị trí xe bus */}
                                    <Source
                                        id="bus-location"
                                        type="geojson"
                                        data={{
                                            type: "Feature",
                                            geometry: { type: "Point", coordinates: busLocation },
                                            properties: {},
                                        }}
                                    >
                                        <Layer
                                            id="bus-point"
                                            type="circle"
                                            paint={{
                                                "circle-radius": 12,
                                                "circle-color": "#1B763E",
                                                "circle-stroke-width": 3,
                                                "circle-stroke-color": "#fff",
                                            }}
                                        />
                                    </Source>

                                    {/* Điểm dừng */}
                                    <Source
                                        id="stop-points"
                                        type="geojson"
                                        data={{
                                            type: "FeatureCollection",
                                            features: stopPoints.map((stop, idx) => ({
                                                type: "Feature",
                                                geometry: {
                                                    type: "Point",
                                                    coordinates: [stop.location.longitude, stop.location.latitude],
                                                },
                                                properties: { id: stop.id, name: stop.name, index: idx + 1 },
                                            })),
                                        }}
                                    >
                                        <Layer
                                            id="stops-circle"
                                            type="circle"
                                            paint={{
                                                "circle-radius": 10,
                                                "circle-color": "#3B82F6",
                                                "circle-stroke-width": 2,
                                                "circle-stroke-color": "#fff",
                                            }}
                                        />
                                        <Layer
                                            id="stops-label"
                                            type="symbol"
                                            layout={{
                                                "text-field": ["get", "index"],
                                                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                                                "text-size": 12,
                                                "text-offset": [0, 0],
                                            }}
                                            paint={{
                                                "text-color": "#fff",
                                            }}
                                        />
                                    </Source>

                                    <NavigationControl position="top-right" />
                                </Map>
                            </div>

                            {/* Thông tin xe */}
                            <div className="flex gap-4 mt-4">
                                {/* Card thông tin xe */}
                                <Card className="flex-1 p-4 bg-[#F9FAFB] flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-400 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-lg">29A-12345</p>
                                        <p className="text-sm text-gray-600">Xe Bus</p>
                                    </div>
                                </Card>

                                {/* Card tài xế */}
                                <Card className="flex-1 p-4 bg-[#F9FAFB] flex flex-col justify-center text-right">
                                    <p className="text-sm">Tài xế</p>
                                    <p className="font-semibold">Nguyễn Văn A</p>
                                </Card>
                            </div>


                            {/* Danh sách điểm đón */}
                            <div className="mt-4 space-y-2">
                                <h4 className="font-semibold text-sm text-gray-700 mb-2">Điểm đón (3)</h4>
                                {stopPoints.map((stop, idx) => (
                                    <Card
                                        key={stop.id}
                                        className="p-3 flex items-center gap-3 bg-[#DDEDF4] border border-gray-200"
                                    >
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{stop.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {idx === 0 && "Lê Lợi, Quận 1"}
                                                {idx === 1 && "Phạm Ngũ Lão, Q1"}
                                                {idx === 2 && "Lê Thánh Tôn, Q1"}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {idx === 0 && "07:00"}
                                            {idx === 1 && "07:10"}
                                            {idx === 2 && "07:20"}
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
