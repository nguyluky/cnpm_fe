import axios from "axios";

const MAPBOX_ACCESS_TOKEN = (import.meta as any).env?.VITE_MAPBOX_API_KEY;

export type MapboxSuggestion = {
    name: string;
    coordinates: [number, number];
};

export const fetchMapboxSuggestions = async (query: string, limit = 5): Promise<MapboxSuggestion[]> => {
    if (!query) return [];
    // Add country=vn to limit results to Vietnam; limit and types help narrow results
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=vn&limit=${limit}&types=place,address,locality,region`;
    try {
        const response = await axios.get(url);
        return (response.data.features || []).map((feature: any) => ({
            name: feature.place_name,
            coordinates: feature.geometry.coordinates as [number, number],
        }));
    } catch (error) {
        console.error("Error fetching Mapbox suggestions:", error);
        return [];
    }
};