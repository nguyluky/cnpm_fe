/**
 * Utility functions for working with Mapbox Directions API
 * Generates encoded route paths between stop points
 */

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface DirectionsResponse {
    code: string;
    routes: Array<{
        geometry: {
            coordinates?: [number, number][];
            type?: string;
        } | string; // Can be encoded polyline string or coordinates object
        legs?: Array<{
            distance: number;
            duration: number;
        }>;
    }>;
}

const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

/**
 * Decode encoded polyline string from Mapbox
 * Mapbox uses Google's polyline encoding algorithm
 * @param encoded - Encoded polyline string
 * @returns Array of [longitude, latitude] pairs
 */
function decodePolyline(encoded: string): [number, number][] {
    const coordinates: [number, number][] = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
        let result = 0;
        let shift = 0;
        let byte;

        // Decode latitude
        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        const dlat = result & 1 ? ~(result >> 1) : result >> 1;
        lat += dlat;

        result = 0;
        shift = 0;

        // Decode longitude
        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        const dlng = result & 1 ? ~(result >> 1) : result >> 1;
        lng += dlng;

        coordinates.push([lng / 1e5, lat / 1e5]); // Mapbox format: [longitude, latitude]
    }

    return coordinates;
}

/**
 * Get route coordinates from Mapbox Directions API
 * Handles both encoded polyline and coordinate array formats
 * @param start - Starting coordinate {latitude, longitude}
 * @param end - Ending coordinate {latitude, longitude}
 * @returns Array of [longitude, latitude] pairs
 */
export async function getRouteCoordinates(
    start: Coordinate,
    end: Coordinate
): Promise<[number, number][]> {
    if (!MAPBOX_API_KEY) {
        throw new Error('VITE_MAPBOX_API_KEY is not set');
    }

    const { latitude: startLat, longitude: startLng } = start;
    const { latitude: endLat, longitude: endLng } = end;

    // Mapbox Directions API expects coordinates as [longitude, latitude]
    const coordinates = `${startLng},${startLat};${endLng},${endLat}`;

    // Request geometry as encoded polyline for efficiency
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=polyline&access_token=${MAPBOX_API_KEY}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Mapbox API error: ${response.statusText}`);
        }

        const data: DirectionsResponse = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            throw new Error('No route found between these points');
        }

        const geometry = data.routes[0].geometry;
        
        // Check if geometry is encoded polyline string
        if (typeof geometry === 'string') {
            return decodePolyline(geometry);
        }
        
        // Otherwise it's a coordinates object
        if (geometry && typeof geometry === 'object' && 'coordinates' in geometry) {
            return geometry.coordinates || [];
        }

        throw new Error('Invalid geometry format from Mapbox API');
    } catch (error) {
        console.error('Error fetching route from Mapbox:', error);
        throw error;
    }
}

/**
 * Generate encoded path for a route with multiple stop points
 * This creates a 3D array: [[pickup_coords], [dropoff_coords]]
 * 
 * For a route with N stop points:
 * - Pickup trip: path from stop 1 to stop N
 * - Dropoff trip: path from stop N back to stop 1 (reverse route)
 * 
 * @param stopPoints - Array of stop point coordinates in order
 * @returns 3D array of coordinates: [pickupPath, dropoffPath]
 */
export async function generateEncodedPath(
    stopPoints: Coordinate[]
): Promise<[number, number][][]> {
    if (stopPoints.length < 2) {
        throw new Error('At least 2 stop points are required');
    }

    if (stopPoints.length > 25) {
        throw new Error('Maximum 25 stop points allowed');
    }

    try {
        // Get pickup route: from first to last stop point
        const firstStopPoint = stopPoints[0];
        const lastStopPoint = stopPoints[stopPoints.length - 1];

        const pickupRoute = await getRouteCoordinates(firstStopPoint, lastStopPoint);
        
        // Get dropoff route: from last to first stop point (reverse)
        const dropoffRoute = await getRouteCoordinates(lastStopPoint, firstStopPoint);

        // Return as 3D array: [pickupRoute, dropoffRoute]
        return [pickupRoute, dropoffRoute];
    } catch (error) {
        console.error('Error generating encoded path:', error);
        throw error;
    }
}

/**
 * Calculate total distance of a route in meters
 * @param coordinates - Array of [longitude, latitude] pairs
 * @returns Distance in meters
 */
export function calculateDistance(coordinates: [number, number][]): number {
    if (coordinates.length < 2) return 0;

    let totalDistance = 0;

    for (let i = 0; i < coordinates.length - 1; i++) {
        const [lon1, lat1] = coordinates[i];
        const [lon2, lat2] = coordinates[i + 1];
        
        // Haversine formula to calculate distance between two points
        const R = 6371000; // Earth's radius in meters
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        totalDistance += distance;
    }

    return Math.round(totalDistance);
}

/**
 * Convert degrees to radians
 */
function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * Validate coordinates are within valid ranges
 */
export function isValidCoordinate(coord: Coordinate): boolean {
    return (
        coord.latitude >= -90 &&
        coord.latitude <= 90 &&
        coord.longitude >= -180 &&
        coord.longitude <= 180
    );
}
