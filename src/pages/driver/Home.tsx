import React from "react";
import { WelcomeBanner } from "../../components/uiPart/WelcomeBanner";
import { TripCard } from "../../components/uiPart/TripCard";
import { QuickInfoSidebar } from "../../components/uiPart/QuickInfoSidebar";
import { Card } from "../../components/uiItem/card";
import { toast } from "sonner";
import { Clock, MapPin, Sun, Sunset } from "lucide-react";
import type { Student } from "../../components/uiPart/TripCard";
import { useApi } from "../../contexts/apiConetxt";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

interface ApiSchedule {
    id: string;
    route: { id: string; name: string };
    bus: { id: string; licensePlate: string };
    type: "DISPATCH" | "RETURN";
    daysOfWeek: number[];
    startTime: string; // "16:00"
    startDate: string;
    endDate: string;
}

interface TodaySchedule {
    scheduleId: string;
    tripId: string;
    date: string;
    static: "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
    type: "DISPATCH" | "RETURN"; // đổi theo API mới
    startTime: string;
}

interface TripInfo {
    id: number | string;
    location: string;
    time: string;
    students: Student[];
    dropPoint: string;
}

// map type của today -> ca (shift) ở UI
function apiTypeToShift(t: "DISPATCH" | "RETURN"): "MORNING" | "AFTERNOON" {
    return t === "DISPATCH" ? "MORNING" : "AFTERNOON";
}

// hàm format giờ từ database vì Khắc Híu lười chuyển
function formatStartTime(isoString: string) {
    if (!isoString) return "---";
    const [, timeMs] = isoString.split("T"); // "06:30:00.000Z"
    const timePart = timeMs?.split(".")[0] ?? "";
    return timePart.substring(0, 5); // "06:30"
}

export const DriverHome: React.FC = () => {
    const api = useApi();

    const [selectedShift, setSelectedShift] = React.useState<"MORNING" | "AFTERNOON">("MORNING");
    const [selectedTrip, setSelectedTrip] = React.useState<TripInfo | null>(null);

    // 1) getDriverSchedules
    const {
        data: driverSchedules = [],
        error: driverError,
        isLoading: isLoadingDriver,
    } = useQuery<ApiSchedule[]>({
        queryKey: ["driverSchedules"],
        queryFn: async () => {
            const sche = await api.api.getDriverSchedules();
            const json = typeof (sche as any).json === "function" ? await (sche as any).json() : sche;
            if (json.code !== 200 || !json.data?.data) {
                throw new Error(json.message || "API getDriverSchedules lỗi hoặc rỗng.");
            }
            return json.data.data as ApiSchedule[];
        },
    });

    // 2) getTodaysSchedules
    const {
        data: todaySchedules = [],
        error: todayError,
        isLoading: isLoadingToday,
    } = useQuery<TodaySchedule[]>({
        queryKey: ["todaySchedules"],
        queryFn: async () => {
            const tdsche = await api.api.getTodaysSchedules();
            const json = typeof (tdsche as any).json === "function" ? await (tdsche as any).json() : tdsche;
            if (json.code !== 200 || !json.data?.data) {
                return [] as TodaySchedule[];
            }
            return json.data.data as TodaySchedule[];
        },
    });

    // chọn schedule để lấy biển số: ưu tiên schedule hôm nay, không phụ thuộc ca
    const firstToday = todaySchedules[0];
    const scheduleForToday = firstToday
        ? driverSchedules.find((s) => s.id === firstToday.scheduleId)
        : driverSchedules[0];

    const licensePlateText =
        scheduleForToday?.bus?.licensePlate
            ? `Xe buýt: ${scheduleForToday.bus.licensePlate}`
            : "---";

    // join todaySchedules với driverSchedules theo scheduleId + map theo ca đang chọn
    const todayShiftTrips: TripInfo[] = todaySchedules
        .filter((t) => apiTypeToShift(t.type) === selectedShift)
        .map((t) => {
            const sched = driverSchedules.find((s) => s.id === t.scheduleId);
            return {
                id: t.tripId,
                location: sched?.route?.name || "Chưa có tên tuyến",
                time: formatStartTime(t.startTime),
                students: [],
                dropPoint: "---",
            } as TripInfo;
        });

    const isLoading = isLoadingDriver || isLoadingToday;
    const error = driverError || todayError;

    const navigate = useNavigate();

    return (
        <div className="p-6">
            <div className="space-y-6">
                <WelcomeBanner
                    driverName="Tài xế hư hỏng của tôi"
                    vehicleId={licensePlateText}
                    date={new Date().toLocaleDateString("vi-VN")}
                />

                {isLoading && <p>Đang tải dữ liệu...</p>}
                {error && <p style={{ color: "red" }}>Lỗi API: {(error as Error).message}</p>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* nút chọn ca */}
                        <div className="flex gap-3 mb-2">
                            <button
                                onClick={() => {
                                    setSelectedShift("MORNING");
                                    setSelectedTrip(null);
                                }}
                                className={`px-4 py-2 rounded-lg border font-medium cursor-pointer ${selectedShift === "MORNING"
                                        ? "bg-orange-500 text-white border-orange-600"
                                        : "bg-white text-gray-700"
                                    }`}
                            >
                                Ca sáng
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedShift("AFTERNOON");
                                    setSelectedTrip(null);
                                }}
                                className={`px-4 py-2 rounded-lg border font-medium cursor-pointer ${selectedShift === "AFTERNOON"
                                        ? "bg-purple-600 text-white border-purple-700"
                                        : "bg-white text-gray-700"
                                    }`}
                            >
                                Ca chiều
                            </button>
                        </div>

                        {/* nếu hôm nay không có ca cho shift đang chọn */}
                        {todayShiftTrips.length === 0 && !isLoading && <p>Hôm nay không có ca cho khung giờ này</p>}

                        {/* danh sách ca hôm nay */}
                        {todayShiftTrips.map((tripInfo, index) => (
                            <Card
                                key={tripInfo.id}
                                className={`p-5 mb-4 cursor-pointer ${selectedTrip?.id === tripInfo.id ? "bg-gray-100" : ""}`}
                                onClick={() => { 
                                    setSelectedTrip(tripInfo);
                                    navigate(`/driver/trip/${tripInfo.id}`);
                                    
                                }}
                            >
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    {selectedShift === "MORNING" ? (
                                        <Sun className="w-5 h-5 text-orange-500" />
                                    ) : (
                                        <Sunset className="w-5 h-5 text-purple-500" />
                                    )}
                                    <span>{`Lịch làm việc hôm nay - ${selectedShift === "MORNING" ? "Ca sáng" : "Ca chiều"}`}</span>
                                </h2>

                                <div
                                    className={`flex justify-between p-4 rounded-lg border mb-5 ${selectedShift === "MORNING" ? "bg-orange-50 border-orange-200" : "bg-purple-50 border-purple-200"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Clock className={`h-5 w-5 ${selectedShift === "MORNING" ? "text-orange-600" : "text-purple-600"}`} />
                                        <span className="font-medium">{tripInfo.time}</span>
                                    </div>
                                    <MapPin className={`h-5 w-5 ${selectedShift === "MORNING" ? "text-orange-600" : "text-purple-600"}`} />
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Sidebar  */}
                    <div className="lg:col-span-1 space-y-6">
                        <QuickInfoSidebar
                            electricCount={3} //Để tạm dữ liệu ảo, khong cần thì xóa sau
                            studyCount={4} //Để tạm dữ liệu ảo, khong cần thì xóa sau
                            WorkCount={todaySchedules.length}
                            routeInfo={{
                                vehicle: "Xe buýt",
                                vehicleId: licensePlateText,
                                route: selectedTrip?.location ?? "---",
                                time: selectedTrip?.time ?? "---",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
