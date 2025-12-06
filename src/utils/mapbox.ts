import axios from "axios";

export type MapboxSuggestion = {
    name: string;
    coordinates: [number, number];
};

export const fetchMapboxSuggestions = async (query: string, limit = 1): Promise<MapboxSuggestion[]> => {
    if (!query) return [];
    // OpenStreetMap Nominatim API URL
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=${limit}&countrycodes=vn`;
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "YourAppName/1.0 (your.email@example.com)", // Replace with your app details
            },
        });
        return (response.data || []).map((result: any) => ({
            name: result.display_name,
            coordinates: [parseFloat(result.lon), parseFloat(result.lat)] as [number, number],
        }));
    } catch (error) {
        console.error("Error fetching OpenStreetMap suggestions:", error);
        return [];
    }
};