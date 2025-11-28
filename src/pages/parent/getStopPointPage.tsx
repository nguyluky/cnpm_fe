import { Search } from "lucide-react";
import { useApi } from "../../contexts/apiConetxt";
import type { StopPointsMeta, GeoLocation } from "../../api/data-contracts";
import { useState, useEffect } from "react";
import { fetchMapboxSuggestions } from "../../utils/mapbox";

interface StopPointsData {
    id: string;
    name: string;
    location: GeoLocation;
    meta: StopPointsMeta;
}

interface MapboxSuggestion {
    name: string;
    coordinates: [number, number];
}

export function GetStopPointPage() {
    const {api} = useApi();
    const [stopPoints, setStopPoints] =  useState<StopPointsData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (query: string) => {
        setSearchTerm(query);
        const results = await fetchMapboxSuggestions(query);
        setSuggestions(results);
    }

    // useEffect(() => {
    //     const fetchStopPoints = async () => {
    //         if (!api) return;
    //         setIsLoading(true);
    //         try {
    //             const response = await api.getAllStoppoints();
    //             setStopPoints(response.data.data?.data || []);
    //         } catch (error) {
    //             console.error("Error fetching stop points:", error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }

    //     // call the fetch function when api becomes available
    //     fetchStopPoints();
    // }, [api]);

    // const normalize = (s?: string | null) => (s ?? "").toLowerCase();

    // const filteredStopPoints = stopPoints.filter((sp) => {
    //     const q = searchTerm.trim().toLowerCase();
    //     if (!q) return true;
    //     const fields = [
    //         normalize(sp.name),
    //         normalize(sp.meta?.addressNo),
    //         normalize(sp.meta?.street),
    //         normalize(sp.meta?.ward),
    //         normalize(sp.meta?.zone),
    //     ];
    //     return fields.some((f) => f.includes(q));
    // });

    return <>
        {/* Search bar */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-white bg-opacity-90 rounded-lg shadow-lg flex 
                    items-center
                    border border-slate-300
                    focus-within:border-blue-500
                    ">
            <input
                type="text"
                placeholder="Tìm kiếm điểm dừng..."
                className="w-full py-2 rounded-lg outline-none px-4 bg-transparent text-gray-700"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="w-6 h-6 text-gray-500 m-2" />
        </div>

        {isLoading && (
            <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="mt-3 text-gray-700">Đang tải...</p>
                </div>
            </div>
        )}

        {/* List of stoppoints */}
        <div className="mt-16 px-4">
            {suggestions.map((suggestion, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md mb-2 border border-gray-200"
                >
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{suggestion.name}</h3>
                        <p className="text-sm text-gray-500">{suggestion.coordinates}</p>
                    </div>
                </div>
            ))}
            {/* {filteredStopPoints.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Không tìm thấy điểm dừng phù hợp.</div>
            ) : (
                filteredStopPoints.map((stopPoint) => (
                    <div
                        key={stopPoint.id}
                        className="flex items-center justify-between p-4 bg-white border-y border-gray-200"
                    >
                        <div className="min-w-0">
                            <h3 className="text-lg font-semibold text-gray-800">{stopPoint.name}</h3>
                            <p className="text-sm text-gray-500 truncate whitespace-nowrap">
                                {[
                                    stopPoint.meta.addressNo ?? '',
                                    stopPoint.meta.street ?? '',
                                    stopPoint.meta.ward ?? '',
                                    stopPoint.meta.zone ?? '',
                                ].filter((v) => v !== undefined && v !== null && v !== '').join(', ')}
                            </p>
                        </div>
                    </div>
                ))
            )} */}
        </div>


    </>
}