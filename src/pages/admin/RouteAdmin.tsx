import { Clock, MapPin, Route, Search } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, NavigationControl, Source, type MapRef } from "react-map-gl/mapbox";
import type { GeoLocation, PaginationMetaData, RouteData, StopPointsMeta } from '../../api/data-contracts.ts';
import { Button } from '../../components/uiItem/button.tsx';
import { Card } from '../../components/uiItem/card.tsx';
import { Pagination } from '../../components/uiPart/Pagination.tsx';
import { useApi } from '../../contexts/apiConetxt.tsx';
const MAPBOX_TOKEN = "pk.eyJ1Ijoibmd1eWx1a3kxIiwiYSI6ImNtZ2Yxb2hoMjAzbW8yam9teHN1MGhiYXYifQ.5gyVRqeLYNO0lXUYIRgpJQ";

interface StopPointsData {
    id: string;
    name: string;
    location: GeoLocation;
    meta: StopPointsMeta;
}

// Hàm helper để ghép địa chỉ
const getFullAddress = (meta: StopPointsData['meta']) => {
    const addressParts = [
        meta.addressNo,
        meta.street,
        meta.ward,
        meta.zone,
    ].filter(Boolean); // Lọc ra các giá trị rỗng

    return addressParts.join(', ') || 'N/A';
};

const RouteCardSkeleton = () => {
    return (
        <Card className="p-4 rounded-xl border border-gray-200 bg-white">
            {/* Header Skeleton */}
            <div className="flex justify-between items-start mb-2 animate-pulse">
                <div className="flex items-center">
                    {/* Skeleton cho chấm tròn màu */}
                    <div className="w-3 h-3 me-3 rounded-full bg-gray-200"></div>
                    {/* Skeleton cho tên tuyến */}
                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                </div>
                {/* Skeleton cho trạng thái (Hoạt động) */}
                <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
            </div>

            {/* Body Skeleton */}
            <div className="flex flex-col gap-2 animate-pulse mt-3">
                {/* Skeleton cho từng dòng thông tin (Distance, OperationTime, Headway) */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                        {/* Skeleton cho icon */}
                        <div className="w-4 h-4 rounded bg-gray-200"></div>
                        {/* Skeleton cho text */}
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

function RouteInfoCard({ route, isSelected, onClick }: {
    route: RouteData;
    isSelected?: boolean;
    onClick: () => void;
}) {
    return <Card
        className={`p-4 rounded-xl border bg-white cursor-pointer hover:shadow-sm transition-shadow` + (isSelected ? ' border-red-500 shadow-md' : ' border-gray-200')}
        onClick={onClick}
    >
<div className="flex flex-wrap items-center justify-between gap-3 mb-2">
    <div className="flex items-center gap-3">
        <span 
            className="flex shrink-0 w-3 h-3 rounded-full" 
            style={{ backgroundColor: route.metadata.Color || '#000000' }}
        />
        <h3 className="font-semibold text-base">
            Tuyến {route.name}
        </h3>
    </div>

    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">
        Hoạt động
    </span>
</div>

        {/* flex-col để hiển thị theo chiều dọc */}
        <div className="flex flex-col gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
                <MapPin size={16} />
                {route.metadata.Distance} km
            </span>

            <span className="flex items-center gap-1">
                <Clock size={16} />
                {route.metadata.OperationTime}
            </span>
            <span className="flex items-center gap-1">
                <Route size={16} />
                {route.metadata.Headway}
            </span>

        </div>
    </Card>

}

export const RouteAdmin: React.FC = () => {
    const { api } = useApi();
    const mapRef = useRef<MapRef>(null)
    const [stopPoints, setStopPoint] = useState<StopPointsData[]>([]);
    const [allRoutes, setAllRoutes] = useState<RouteData[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMetaData | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState("");
    const [loadingStopPoints, setLoadingStopPoints] = useState(false);
    const [viewDirection, setViewDirection] = useState<[boolean, boolean]>([true, true]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    

    const [viewState, setViewState] = useState({
        latitude: 10.771,
        longitude: 106.698,
        zoom: 14,
    });

    const fitViewToProps = useCallback((points: StopPointsData[]) => {
        if (!mapRef.current || points.length === 0) return;

        // 1. Tạo một đối tượng Bounds rỗng
        const bounds = new mapboxgl.LngLatBounds();

        // 2. Mở rộng bounds để bao chứa tất cả các điểm
        points.forEach(point => {
            bounds.extend([point.location.longitude, point.location.latitude]);
        });

        // 3. Gọi fitBounds trên map instance
        mapRef.current.fitBounds(bounds, {
            padding: 40, // Khoảng cách đệm (pixel) để các điểm không bị sát mép
            maxZoom: 16, // Không zoom quá gần nếu chỉ có 1-2 điểm
            duration: 1000 // Hiệu ứng zoom mượt trong 1 giây
        });

        // LƯU Ý: Khi gọi fitBounds, Mapbox sẽ tự động kích hoạt sự kiện 'move'
        // và cập nhật viewState của bạn thông qua onMove.
    }, []);

    useEffect(() => {

        const processData = async () => {
            await api.getAllRoutes({
                page: page,
                limit: pageSize,
                search: search
            }).then((routes) => {
                setPaginationMeta(routes.data?.data?.meta || null);
                setAllRoutes(routes.data?.data?.data || []);
            });
        }
        setLoading(true);
        processData().finally(() => setLoading(false));
        console.log("Fetching routes data...");

    }, [api, page, pageSize, search]);

    useEffect(() => {
        const fetchStopPoints = async () => {
            try {
                const response = await api.getRouteById(selectedRouteId || "");
                setStopPoint(response.data?.data?.stopPoints || []);
                fitViewToProps(response.data?.data?.stopPoints || []);
            } catch (error) {
                console.error("Error fetching stop points:", error);
            }
        };

        setLoadingStopPoints(true);
        fetchStopPoints().finally(() => setLoadingStopPoints(false));
    }, [api, fitViewToProps, selectedRouteId]);


    const routeGeoJSON = useMemo(() => {
        const selectedRoute = allRoutes.find(route => route.id === selectedRouteId);
        const encodedRouteString = selectedRoute?.metadata?.encodedPath;
        console.log("Selected Route ID:", selectedRoute);
        console.log("Encoded Route String:", encodedRouteString);
        const coordinates: ([number, number][])[] = JSON.parse(encodedRouteString || '[[], []]') as ([number, number][])[];
        console.log("Decoded Coordinates:", coordinates[0]);

        return coordinates;
    }, [allRoutes, selectedRouteId]);

    return (
        <div className="flex flex-col bg-[#E0E7FF] w-full h-screen">
            <div className="flex-1 mx-7 my-5 flex flex-col xl:flex-row gap-5 overflow-hidden">
                {/* Left Column - Danh sách tuyến */}
                <Card className="xl:w-96 w-full h-fit xl:h-full p-5 flex flex-col gap-4 overflow-hidden">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Quản lý tuyến đường</h2>
                          <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700"
                          >
                            + Tạo tuyến mới
                          </Button>
                    </div>

                    {
                        // search box
                    }
                    <div className="flex items-center">
                        <div className="relative w-full">
                            <input type="text" value={
                                searchTerm
                            }
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Search branch name..." required />
                        </div>
                        <button onClick={() => {
                            setSearch(searchTerm);
                        }} className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                            <Search className="w-4 h-4" />
                            <span className="sr-only">Search</span>
                        </button>
                    </div>


                    <div className="overflow-y-auto flex-1">
                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <RouteCardSkeleton key={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {allRoutes.map((route, index) => <RouteInfoCard key={route.id + "-" + index} route={route} isSelected={selectedRouteId === route.id} onClick={() => {
                                    setSelectedRouteId(route.id);
                                }} />)}
                            </div>
                        )}
                    </div>

                    <Pagination
                        currentPage={page}
                        totalPages={paginationMeta ? Math.ceil(paginationMeta.total / paginationMeta.limit) : 1}
                        onPageChange={(newPage) => setPage(newPage)}
                        pageSize={pageSize}
                        onPageSizeChange={(newSize) => setPageSize(newSize)}
                    />
                </Card>

                {/* Right Column - Bản đồ + Thông tin */}
                <div className="flex-1 flex flex-col gap-5">
                    {/* Bản đồ */}
                    <Card className="flex-1 min-h-96">
                        <div className="p-5 h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5" />
                                <span className="font-semibold text-xl">Tuyến {stopPoints[0]?.name} - {stopPoints[stopPoints.length - 1]?.name}</span>
                            </div>

                            <div className="flex-1 rounded-lg overflow-hidden relative max-h-2/3">
                                <Map
                                    {...viewState}
                                    onMove={(evt) => setViewState(evt.viewState)}
                                    mapboxAccessToken={MAPBOX_TOKEN}
                                    mapStyle="mapbox://styles/mapbox/streets-v9"
                                    style={{ width: "100%", height: "100%" }}
                                    ref={mapRef}
                                >

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


                                    <Source id="route-source" type="geojson" data={{
                                        type: "Feature",
                                        properties: {},
                                        geometry: {
                                            type: 'LineString',
                                            coordinates: viewDirection[0] ? routeGeoJSON[0] : []
                                        }
                                    }}>
                                        <Layer
                                            id="route-layer"
                                            type="line"
                                            layout={{
                                                'line-join': 'round',
                                                'line-cap': 'round'
                                            }}
                                            paint={{
                                                // mau xanh dương
                                                'line-color': "#3B82F6",
                                                'line-width': 5,
                                                'line-opacity': 0.8
                                            }}
                                        />
                                    </Source>
                                    <Source id="route-source-2" type="geojson" data={{
                                        type: "Feature",
                                        properties: {},
                                        geometry: {
                                            type: 'LineString',
                                            coordinates: viewDirection[1] ? routeGeoJSON[1] : []
                                        }
                                    }}>
                                        <Layer
                                            id="route-layer-2"
                                            type="line"
                                            layout={{
                                                'line-join': 'round',
                                                'line-cap': 'round'
                                            }}
                                            paint={{
                                                // mau đỏ 
                                                'line-color': "#EF4444",
                                                'line-width': 5,
                                                'line-opacity': 0.8
                                            }}
                                        />
                                    </Source>

                                    <NavigationControl position="top-right" />
                                </Map>

                                {
                                    // Hiển thị overlay bật tắt hướng đi 
                                }

                                <div className="absolute bottom-4 right-4 bg-white rounded-md shadow-md p-2 flex flex-col gap-2">
                                    <label className="flex items-center gap-2">
                                        <input checked={viewDirection[0]} onChange={(e) => { setViewDirection([e.target.checked, viewDirection[1]]); }} type="checkbox" className="form-checkbox h-4 w-4 gb-blue-600 " />
                                        <span className="text-sm font-medium text-gray-700">Hướng đi</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="form-checkbox h-4 w-4 bg-red-600 " checked={viewDirection[1]} onChange={(e) => { setViewDirection([viewDirection[0], e.target.checked]); }} />
                                        <span className="text-sm font-medium text-gray-700">Hướng về</span>
                                    </label>
                                </div>

                                {
                                    loadingStopPoints && (
                                        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                                            <span className="loading loading-spinner loading-xl"></span>
                                        </div>
                                    )
                                }
                            </div>

                            {/* Danh sách điểm đón */}
                            <div className="mt-4 space-y-2 overflow-y-auto h-1/3">
                                <h4 className="font-semibold text-sm text-gray-700 mb-2 ">Điểm đón ({
                                    stopPoints.length
                                })</h4>
                                {stopPoints.map((stop, idx) => (
                                    <Card
                                        key={stop.id + "-" + idx}
                                        className="p-3 flex items-center gap-3 bg-[#DDEDF4] border border-gray-200"
                                        onClick={() => {
                                            mapRef.current?.flyTo({
                                                center: [stop.location.longitude, stop.location.latitude],
                                                zoom: 16,
                                            });
                                        }}
                                    >
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{stop.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {
                                                    // Hiển thị địa chỉ nếu có, nếu không thì hiển thị kinh độ vĩ độ
                                                }
                                                {getFullAddress(stop.meta)}
                                            </p>
                                        </div>
                                        {
                                            // <p className="text-sm text-gray-600">
                                            //     {idx === 0 && "07:00"}
                                            //     {idx === 1 && "07:10"}
                                            //     {idx === 2 && "07:20"}
                                            // </p>

                                        }
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
                      {/* Modal Tạo tuyến đường mới */}
          {isCreateModalOpen && (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md bg-white rounded-xl shadow-xl">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Tạo tuyến đường mới</h3>

                  <div className="space-y-4">
                    {/* Tên tuyến */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên tuyến
                      </label>
                      <input
                        type="text"
                        placeholder="Tuyến 3 - Quận 5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>

                    {/* Mô tả */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                      </label>
                      <textarea
                        placeholder="Mô tả tuyến đường"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                      />
                    </div>

                    <div className="flex gap-4">
                      {/* Khoảng cách */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Khoảng cách
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            defaultValue="10"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            km
                          </span>
                        </div>
                      </div>

                      {/* Thời gian dự kiến */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thời gian dự kiến
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            defaultValue="30"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-16 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            phút
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="flex justify-end gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={() => {
                        // Xử lý tạo tuyến ở đây
                        setIsCreateModalOpen(false);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Tạo tuyến
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
    );
}
