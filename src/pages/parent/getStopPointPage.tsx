import { Search } from "lucide-react";
import { useApi } from "../../contexts/apiConetxt";
import type { StopPointsMeta, GeoLocation } from "../../api/data-contracts";
import { useState, useEffect } from "react";
import { fetchMapboxSuggestions } from "../../utils/mapbox";
import { type FormEvent } from "react"; // Import FormEvent for type safety
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChooseRoutePage } from "./ChooseRoutePage";
import { path } from "../../router";

// interface Student {
//     id: string;
//     name: string;
//     meta: {
//         class?: string;
//         gender?: "Nam" | "Nữ";
//         birthday?: string;
//         nickname?: string;
//         studentCode?: string;
//         address?: string;
//         parentName?: string;
//         phone?: string;
//         school?: string;
//     };
// }

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
    const { api } = useApi();
    const [stopPoints, setStopPoints] = useState<StopPointsData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams(); 
    const studentId = searchParams.get('studentId');

    const navigate = useNavigate();
    const RADIUS_METERS = 2000; // Adjust radius as needed

    const calculateBounds = (lat: number, lng: number, radius: number) => {
        const earthRadius = 6371000; // Earth radius in meters
        const latDelta = (radius / earthRadius) * (180 / Math.PI);
        const lngDelta = (radius / (earthRadius * Math.cos((Math.PI / 180) * lat))) * (180 / Math.PI);

        return {
            north: lat + latDelta,
            south: lat - latDelta,
            east: lng + lngDelta,
            west: lng - lngDelta,
        };
    };

    const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
        const earthRadius = 6371000; // Earth radius in meters

        const dLat = toRadians(lat2 - lat1);
        const dLng = toRadians(lng2 - lng1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
                Math.cos(toRadians(lat2)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    };

    const handleSearchSubmit = async (e: FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (!searchTerm.trim()) return; // Avoid empty searches

        const results = await fetchMapboxSuggestions(searchTerm);
        setSuggestions(results);

        if (results.length > 0) {
            const [lng, lat] = results[0].coordinates; // Use the first suggestion as the center point
            const bounds = calculateBounds(lat, lng, RADIUS_METERS);

            try {
                setIsLoading(true);
                const response = await api.getAllStoppoints({
                    east: bounds.east,
                    north: bounds.north,
                    south: bounds.south,
                    west: bounds.west,
                    isUse: true,
                });

                const stopPointsData = response.data.data?.data || [];

                // Sort stop points by distance from the selected location
                const sortedStopPoints = stopPointsData.sort((a, b) => {
                    const distanceA = haversineDistance(lat, lng, a.location.latitude, a.location.longitude);
                    const distanceB = haversineDistance(lat, lng, b.location.latitude, b.location.longitude);
                    return distanceA - distanceB;
                });

                setStopPoints(sortedStopPoints);
            } catch (error) {
                console.error("Error fetching stop points within bounds:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4 text-center mt-4">Chọn điểm dừng</h2>
                {/* Search bar */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="absolute left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-white bg-opacity-90 rounded-lg shadow-lg flex 
                    items-center
                    border border-slate-300
                    focus-within:border-blue-500"
                >
                    <input
                        type="text"
                        placeholder="Tìm kiếm điểm dừng..."
                        className="w-full py-2 rounded-lg outline-none px-4 bg-transparent text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state only
                    />
                    <button type="submit" className="m-2 p-2 bg-blue-500 text-white rounded-lg">
                        <Search className="w-6 h-6" />
                    </button>
                </form>

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
                    {stopPoints.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">Không tìm thấy điểm dừng phù hợp.</div>
                    ) : (
                        stopPoints.map((stopPoint) => (
                            <div
                                key={stopPoint.id}
                                className="flex items-center justify-between p-4 bg-white border-y border-gray-200"
                            >
                                <div className="min-w-0" onClick={(e) => {
                                    // e.preventDefault();
                                    console.log("Navigating to:", `${path.PARENT_CHOOSE_ROUTE}?studentId=${studentId}&stopPointId=${stopPoint.id}`);
                                    navigate(`${path.PARENT_CHOOSE_ROUTE}?studentId=${studentId}&stopPointId=${stopPoint.id}`);
                                }}>
                                    <h3 className="text-lg font-semibold text-gray-800">{stopPoint.name}</h3>
                                    <p className="text-sm text-gray-500 truncate whitespace-nowrap">
                                        {[
                                            stopPoint.meta.addressNo ?? "",
                                            stopPoint.meta.street ?? "",
                                            stopPoint.meta.ward ?? "",
                                            stopPoint.meta.zone ?? "",
                                        ]
                                            .filter((v) => v !== undefined && v !== null && v !== "")
                                            .join(", ")
                                        }
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
