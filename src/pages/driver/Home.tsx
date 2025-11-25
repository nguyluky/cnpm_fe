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

interface ApiSchedule {
  id: string;
  route: { id: string; name: string };
  bus: { id: string; licensePlate: string };
  type: "MORNING" | "AFTERNOON";
  daysOfWeek: number[];
  startDate: string;
  startTime: string;
}

interface TripInfo {
  id: number | string;
  location: string;
  time: string;
  students: Student[];
  dropPoint: string;
}

export const DriverHome: React.FC = () => {
  const api = useApi();

  // State cho ca sáng/chiều và chuyến được chọn
  const [selectedShift, setSelectedShift] = React.useState<"MORNING" | "AFTERNOON">("MORNING");
  const [selectedTrip, setSelectedTrip] = React.useState<TripInfo | null>(null);

  // Dùng React Query để lấy dữ liệu API
  const { data, error, isLoading } = useQuery({
    queryKey: ["driverSchedules"],
    queryFn: async () => {
      const result = await api.api.getDriverSchedules();
      // Nếu result là Response (fetch), phải .json()
      // Nếu đã là object rồi, thì giữ nguyên
      if (typeof result.json === "function") {
        // Nếu là Response, lấy JSON thực sự
        const json = await result.json();
        console.log("Kết quả JSON getDriverSchedules:", json);
        if (json.code !== 200 || !json.data?.data) {
          throw new Error(json.message || "API trả dữ liệu lỗi hoặc rỗng.");
        }
        return json.data.data;
      } else {
        // Nếu đã là object rồi
        console.log("Kết quả lập tức getDriverSchedules:", result);
        if (result.code !== 200 || !result.data?.data) {
          throw new Error(result.message || "API trả dữ liệu lỗi hoặc rỗng.");
        }
        return result.data.data;
      }
    },
  });


  // Xử lý ca hiện tại
  const currentShiftSchedules: ApiSchedule[] = (data || []).filter((sch) => sch.type === selectedShift);

  // Xử lý sự kiện
  const handlePickUp = (student: Student) => toast.success(`✅ Đã đón ${student.name}`);
  const handleAbsent = (student: Student) => toast.info(`📋 ${student.name} vắng mặt`);

  return (
    <div className="p-6">
      <div className="space-y-6">
        <WelcomeBanner
          driverName="Nguyễn Thành Luân"
          vehicleId={currentShiftSchedules[0]?.bus?.licensePlate ? `Xe buýt: ${currentShiftSchedules[0].bus.licensePlate}` : "---"}
          date={new Date().toLocaleDateString("vi-VN")}
        />

        {isLoading && <p>Đang tải dữ liệu...</p>}
        {error && <p style={{ color: "red" }}>Lỗi API: {error.message}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-3 mb-2">
              <button
                onClick={() => {
                  setSelectedShift("MORNING");
                  setSelectedTrip(null);
                }}
                className={`px-4 py-2 rounded-lg border font-medium cursor-pointer ${selectedShift === "MORNING" ? "bg-orange-500 text-white border-orange-600" : "bg-white text-gray-700"}`}
              >
                Ca sáng
              </button>
              <button
                onClick={() => {
                  setSelectedShift("AFTERNOON");
                  setSelectedTrip(null);
                }}
                className={`px-4 py-2 rounded-lg border font-medium cursor-pointer ${selectedShift === "AFTERNOON" ? "bg-purple-600 text-white border-purple-700" : "bg-white text-gray-700"}`}
              >
                Ca chiều
              </button>
            </div>

            {currentShiftSchedules.length === 0 && !isLoading && (
              <p>Không có dữ liệu ca cho ca này</p>
            )}

            {currentShiftSchedules.map((sched, index) => {
              const tripInfo: TripInfo = {
                id: sched.id,
                location: sched.route.name,
                time: sched.startTime
                 
                ,
                students: [], // Không có dữ liệu từ API, nên để rỗng
                dropPoint: "---",
              };
              return (
                <Card
                  key={sched.id}
                  className={`p-5 mb-4 cursor-pointer ${selectedTrip?.id === tripInfo.id ? "bg-gray-100" : ""}`}
                  onClick={() => setSelectedTrip(tripInfo)}
                >
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {sched.type === "MORNING" ? <Sun className="w-5 h-5 text-orange-500" /> : <Sunset className="w-5 h-5 text-purple-500" />}
                    <span>{`Lịch làm việc hôm nay - ${sched.type === "MORNING" ? "Ca sáng" : "Ca chiều"}`}</span>
                  </h2>
                  <div
                    className={`flex justify-between p-4 rounded-lg border mb-5 ${sched.type === "MORNING" ? "bg-orange-50 border-orange-200" : "bg-purple-50 border-purple-200"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className={`h-5 w-5 ${sched.type === "MORNING" ? "text-orange-600" : "text-purple-600"}`} />
                      <span className="font-medium">{tripInfo.time}</span>
                    </div>
                    <MapPin className={`h-5 w-5 ${sched.type === "MORNING" ? "text-orange-600" : "text-purple-600"}`} />
                  </div>
                  <div className="space-y-3">
                    <TripCard
                      index={index + 1}
                      location={tripInfo.location}
                      time={tripInfo.time}
                      students={tripInfo.students}
                      onPickUp={handlePickUp}
                      onAbsent={handleAbsent}
                    />
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <QuickInfoSidebar
              electricCount={3}
              studyCount={4}
              WorkCount={data ? data.length : 0}
              routeInfo={{
                vehicle: "Xe buýt",
                vehicleId: currentShiftSchedules[0]?.bus?.licensePlate ? currentShiftSchedules[0].bus.licensePlate : "---",
                route: selectedTrip?.location ?? "---",
                // dropPoint: selectedTrip?.dropPoint ?? "---",
                time: selectedTrip?.time ?? "---",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
