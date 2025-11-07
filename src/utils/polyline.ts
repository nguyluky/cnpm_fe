/**
 * Giải mã chuỗi Polyline thành mảng tọa độ [longitude, latitude].
 * @param encodedStr Chuỗi polyline đã mã hóa
 * @param precision Độ chính xác (phải khớp với lúc mã hóa, mặc định 5)
 * @returns Mảng các cặp tọa độ [[lng, lat], ...]
 */
export function decodePolyline(encodedStr: string, precision: number = 5): [number, number][] {
    let index = 0;
    let lat = 0;
    let lng = 0;
    const coordinates: [number, number][] = [];
    const factor = Math.pow(10, precision);

    while (index < encodedStr.length) {
        // Giải mã delta latitude
        let b;
        let shift = 0;
        let result = 0;
        do {
            b = encodedStr.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dLat = (result & 1) ? ~(result >> 1) : (result >> 1);
        lat += dLat;

        // Giải mã delta longitude
        shift = 0;
        result = 0;
        do {
            b = encodedStr.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dLng = (result & 1) ? ~(result >> 1) : (result >> 1);
        lng += dLng;

        // Thêm tọa độ vào mảng kết quả (chia lại cho factor để lấy giá trị thực)
        coordinates.push([lng / factor, lat / factor]);
    }

    return coordinates;
}
