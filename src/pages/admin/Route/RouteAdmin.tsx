import { useQuery } from '@tanstack/react-query';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Clock, MapPin, MinusIcon, Pencil, Route, Search } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Source, type MapRef } from "react-map-gl/mapbox";
import type { PaginationMetaData, RouteData } from '../../../api/data-contracts.ts';
import { Button } from '../../../components/uiItem/button.tsx';
import { Card } from '../../../components/uiItem/card.tsx';
import { Pagination } from '../../../components/uiPart/Pagination.tsx';
import { useApi } from '../../../contexts/apiConetxt.tsx';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

interface StopPointsData {
    id: string;
    name: string;
    location: {
        latitude: number;
        longitude: number;
    };
    meta: {
        addressNo?: string;
        street?: string;
        ward?: string;
        zone?: string;
    };
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
        key={route.id}
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
                {route.metadata.Distance}m
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


function AutoCompleteStopPointInput({
    onChange,
    value,
    moveUp,
    moveDown,
    remove,
}: {
    onChange: (stopPoint: StopPointsData | null) => void;
    value: StopPointsData | null;
    moveUp?: () => void;
    moveDown?: () => void;
    remove?: () => void;
}) {

    const { api } = useApi();
    const [term, setTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedItem, setSelectedItem] = useState<number>(0);
    const listRef = useRef<HTMLUListElement>(null);
    const [onFocus, setOnFocus] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(term);
        }, 500); // debounce 500ms

        return () => {
            clearTimeout(handler);
        };
    }, [term]);

    const { data, isLoading } = useQuery({
        queryKey: ['stop-point-suggestions', debouncedSearch],
        queryFn: async () => {
            const response = await api.getAllStoppoints({
                name: debouncedSearch,
            });
            return response.data?.data?.data || [];
        },
        enabled: debouncedSearch.length > 0,
    })

    useEffect(() => {
        setSelectedItem(0);
    }, [data]);

    useEffect(() => {
        if (listRef.current) {
            const selectedElement = listRef.current.children[selectedItem] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });// Scroll to the selected item
            }
        }
    }, [selectedItem]);


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedItem((prev) => (data && data.length > 0) ? (prev + 1) % data.length : 0);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedItem((prev) => (data && data.length > 0) ? (prev - 1 + data.length) % data.length : 0);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (data && data.length > 0) {
                onChange(data[selectedItem]);
                setTerm("");
                setDebouncedSearch("");
            }
        }
    }

    return value ? (
        <div className="flex items-center gap-2 mb-2 border border-gray-300 rounded-lg bg-gray-50">
            <div className="flex-1 p-2">
                <p className="font-medium">{value.name}</p>
                <p className="text-sm text-gray-500">{getFullAddress(value.meta)}</p>
            </div>

            <div>

                {
                    // move up down buttons
                }
                <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer p-2"
                    onClick={moveUp}
                >
                    <ArrowUp className="w-4 h-4" />
                </button>
                <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer p-2"
                    onClick={moveDown}
                >
                    <ArrowDown className="w-4 h-4" />
                </button>

                {
                    // nút chỉnh sửa
                }

                <button
                    onClick={() => {
                        onChange(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer p-2"
                >
                    <Pencil className="w-4 h-4" />
                </button>
            </div>
        </div>
    ) :
        <label className=" flex items-center gap-2 mb-2 border border-gray-300 rounded-lg p-2 bg-white relative">
            <input type="text" className=" w-full border-0 focus:ring-0 outline-none " placeholder="Nhập điểm dừng"
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setOnFocus(true)}
                onBlur={() => setOnFocus(false)}
            />
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer" onClick={remove}>
                <MinusIcon className="w-4 h-4" />
            </button>

            {/* Dropdown gợi ý tự động (ví dụ tĩnh) */}
            <div className={"absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto "
                + (onFocus ? " block " : " hidden ")
            }>
                {
                    (() => {

                        if (debouncedSearch.length === 0) {
                            return <div className="p-4 text-center text-gray-500">
                                Nhập để tìm điểm dừng...
                            </div>;
                        }

                        if (isLoading) {
                            return <div className="p-4 text-center text-gray-500">
                                Đang tải gợi ý...
                            </div>;
                        }

                        if (data && data.length > 0) {
                            return <ul ref={listRef}>
                                {data.map((stop, idx) => (
                                    <li key={stop.id} className={"px-4 py-2 hover:bg-gray-100 cursor-pointer " + (selectedItem == idx ? " bg-gray-100" : "")}
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // prevent blur event
                                            onChange(stop);
                                            setTerm("");
                                            setDebouncedSearch("");
                                        }}
                                    >
                                        <p className="font-medium">{stop.name}</p>
                                        <p className="text-sm text-gray-500">{getFullAddress(stop.meta)}</p>
                                    </li>
                                ))}
                            </ul>;
                        }

                        return <div className="p-4 text-center text-gray-500">
                            Không tìm thấy điểm dừng phù hợp.
                        </div>;

                    })()
                }

            </div>
        </label>
}


function CreateRouteForm({ onClose, }: { onClose?: () => void; }) {
    const [listStopPoints, setListStopPoints] = useState<(StopPointsData | null)[]>([]);

    return <>
        <header className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Tạo tuyến đường mới</h2>
            <Button
                onClick={onClose}
                className="bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded-lg hover:bg-gray-400"
            >
                Đóng
            </Button>
        </header>
        <aside className="grid grid-cols-[1fr_auto] gap-4">
            <div className="">
                <label className="block mb-1 font-medium">Tên tuyến</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Nhập tên tuyến" />
            </div>
            <div>
                <label className="block mb-1 font-medium">Màu tuyến</label>
                <input type="color" className="w-16 h-10 border border-gray-300 rounded-lg p-1" defaultValue="#3B82F6" />
            </div>
            <div className="col-span-2">
                <label className="block mb-1 font-medium">Thời gian hoạt động</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Ví dụ: 07:00 - 17:00" />
            </div>
            <div className="col-span-2">
                <label className="block mb-1 font-medium">Khoảng cách giữa các chuyến (Headway)</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Ví dụ: 15 phút" />
            </div>
            <div className="col-span-2">
                <label className="block mb-1 font-medium">Điểm dừng</label>

                <button
                    onClick={() => {
                        setListStopPoints([ null, ...listStopPoints,]);
                    }}
                    className="w-full border border-gray-300 border-dashed rounded-lg p-2 bg-gray-100 hover:bg-gray-200 mb-2">
                    + Thêm điểm dừng
                </button>

                {
                    listStopPoints.map((stop, idx) => (
                        <AutoCompleteStopPointInput
                            key={idx}
                            value={stop}
                            moveUp={() => {
                                if (idx === 0) return;
                                const newList = [...listStopPoints];
                                const temp = newList[idx - 1];
                                newList[idx - 1] = newList[idx];
                                newList[idx] = temp;
                                setListStopPoints(newList);
                            }}
                            moveDown={() => {
                                if (idx === listStopPoints.length - 1) return;
                                const newList = [...listStopPoints];
                                const temp = newList[idx + 1];
                                newList[idx + 1] = newList[idx];
                                newList[idx] = temp;
                                setListStopPoints(newList);
                            }}
                            onChange={(v) => {
                                const newList = [...listStopPoints];
                                newList[idx] = v;
                                setListStopPoints(newList);
                            }} 
                            remove={() => {
                                const newList = listStopPoints.filter((_, i) => i !== idx);
                                setListStopPoints(newList);
                            }}
                        />
                    ))
                }
            </div>
            <Button
                disabled
                title="Chức năng này đang được phát triển"
                className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded-lg opacity-60 cursor-not-allowed"
            >
                Tạo tuyến (chưa khả dụng)
            </Button>
        </aside>
    </>
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
    const [isCreate, setIsCreate] = useState(false);
    const [showStopPointsList, setShowStopPointsList] = useState(false);


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

    const fetchRoutes = async (p = page, ps = pageSize, s = search) => {
        setLoading(true);
        try {
            const routes = await api.getAllRoutes({
                page: p,
                limit: ps,
                search: s,
            });
            setPaginationMeta(routes.data?.data?.meta || null);
            setAllRoutes(routes.data?.data?.data || []);
        } catch (err) {
            console.error('Error fetching routes', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
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
                {/* Left Column - Danh sách tuyến , tao*/}
                <Card className="xl:w-96 w-full h-fit xl:h-full p-5 flex flex-col gap-4 overflow-hidden">
                    {
                        isCreate ? (
                            <CreateRouteForm onClose={() => setIsCreate(false)} />
                        ) : (
                            <>
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Quản lý tuyến đường</h2>
                                    <Button
                                        onClick={() => { 
                                                setIsCreate(true); 
                                                setShowStopPointsList(false); 
                                                setSelectedRouteId(null);
                                            }}
                                        className="bg-[#6366F1] text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700"
                                    >
                                        + Tạo tuyến mới
                                    </Button>
                                </div>

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
                                    }}
                                        className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
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
                                            {allRoutes.map((route) => <RouteInfoCard key={route.id} route={route} isSelected={selectedRouteId === route.id} onClick={() => {
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
                            </>
                        )
                    }
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

                            <div className="flex-1 rounded-lg overflow-hidden relative">
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

                                    {
                                        // <NavigationControl position="top-right" />
                                    }
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
                                    // overlay diem dừng
                                }
                                <div className={"absolute top-4 bg-white rounded-md shadow-md p-2 flex flex-col gap-2 transition-all duration-300 "
                                    + (showStopPointsList ? "right-4" : "-right-96")
                                }>
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2 flex justify-between">
                                        <span>
                                            Điểm đón ({
                                                stopPoints.length
                                            })
                                        </span>
                                        <button
                                            onClick={() => {
                                                setShowStopPointsList(!showStopPointsList);
                                            }}
                                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </h4>
                                    <div className="pl-4 overflow-y-auto max-h-100 ">
                                        <ol className="text-gray-500 border-s border-gray-200 w-full relative">
                                            {stopPoints.map((stop, idx) => (
                                                <li className="mb-10 ms-6">
                                                    <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white">
                                                        {idx + 1}
                                                    </span>
                                                    <h3 className="font-medium text-lg text-gray-900">{
                                                        stop.name
                                                    }</h3>
                                                    <p className="text-sm w-2xs">{
                                                        getFullAddress(stop.meta)
                                                    }</p>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>

                                {
                                    // nút bật danh sách điểm dừng
                                }
                                <div className={"absolute top-5 transition-all duration-300 " + (
                                    !showStopPointsList ? "right-4" : "-right-8"
                                )}>
                                    <ArrowLeft className="w-6 h-6 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-100" onClick={() => {
                                        setShowStopPointsList(true);
                                    }} />
                                </div>

                                {
                                    // overlay loading khi load điểm dừng
                                }
                                {
                                    loadingStopPoints && (
                                        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                                            <span className="loading loading-spinner loading-xl"></span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
