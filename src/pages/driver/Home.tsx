import React from "react";
import { WelcomeBanner } from "../../components/uiPart/WelcomeBanner";
import { TripCard } from "../../components/uiPart/TripCard";
import { QuickInfoSidebar } from "../../components/uiPart/QuickInfoSidebar";
import { Card } from "../../components/uiItem/card";
import { toast } from "sonner";
import { Clock, MapPin, Sun, Sunset } from "lucide-react";
import { useApi } from "../../contexts/apiConetxt";
import { useQuery } from "@tanstack/react-query";
import type { Student } from "../../components/uiPart/TripCard";

interface TripStop {
  id: string;
  name: string;
  location: number[];
  sequence: number;
  status: "PENDING" | "ARRIVED" | "DONE" | "SKIPPED";
}


export const DriverHome: React.FC = () => {
  const api = useApi();

  // ================================
  // 1) Load Schedules
  // ================================
  const { data: scheduleRes, isLoading: scheduleLoading } = useQuery({
    queryKey: ["driver-schedules"],
    queryFn: async () => {
      const res = await api.api.getDriverSchedules();
      return res.data.data?.data ?? [];
    },
  });

  const schedules = scheduleRes ?? [];

  const [selectedShift, setSelectedShift] =
    React.useState<"MORNING" | "AFTERNOON">("MORNING");

  const selectedSchedule = schedules.find((s) => s.type === selectedShift);

  // ================================
  // 2) Load Trip khi user chọn ca
  // ================================
  const { data: tripRes, isLoading: tripLoading } = useQuery({
    queryKey: ["driver-trip", selectedSchedule?.id],
    enabled: !!selectedSchedule?.id,
    queryFn: async () => {
      const res = await api.api.getTripById(selectedSchedule!.id);
      return res.data.data;
    },
  });

  const tripInfo = tripRes;

  // ================================
  // 3) Stops
  // ================================
  const pickupPoints: TripStop[] = tripInfo?.stops ?? [];

  const [selectedTrip, setSelectedTrip] = React.useState<TripStop | null>(null);

  React.useEffect(() => {
    setSelectedTrip(null);
  }, [selectedShift]);

  const handlePickUp = (student: Student) =>
    toast.success(`Đã đón ${student.name}`);

  const handleAbsent = (student: Student) =>
    toast.info(`${student.name} vắng mặt`);

  // ================================
  // RENDER
  // ================================
  return (
    <div className="p-6">
      <div className="space-y-6">
        <WelcomeBanner
          driverName="Nguyễn Thành Luân"
          vehicleId={tripInfo?.bus?.licensePlate ?? "Xe buýt"}
          date={new Date().toLocaleDateString("vi-VN")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAIN */}
          <div className="lg:col-span-2 space-y-6">
            {/* CHỌN CA */}
            <div className="flex gap-3 mb-2">
              <button
                onClick={() => setSelectedShift("MORNING")}
                className={`px-4 py-2 rounded-lg border font-medium cursor-pointer ${
                  selectedShift === "MORNING"
                    ? "bg-orange-500 text-white border-orange-600"
                    : "bg-white text-gray-700"
                }`}
              >
                Ca sáng
              </button>

              <button
                onClick={() => setSelectedShift("AFTERNOON")}
                className={`px-4 py-2 rounded-lg border font-medium cursor-pointer ${
                  selectedShift === "AFTERNOON"
                    ? "bg-purple-600 text-white border-purple-700"
                    : "bg-white text-gray-700"
                }`}
              >
                Ca chiều
              </button>
            </div>

            {/* CARD CA */}
            <Card className="p-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                {selectedShift === "MORNING" ? (
                  <Sun className="w-5 h-5 text-orange-500" />
                ) : (
                  <Sunset className="w-5 h-5 text-purple-500" />
                )}
                <span>
                  Lịch làm việc hôm nay -{" "}
                  {selectedShift === "MORNING" ? "Ca sáng" : "Ca chiều"}
                </span>
              </h2>

              {/* THỜI GIAN */}
              <div
                className={`flex justify-between p-4 rounded-lg border mb-5 ${
                  selectedShift === "MORNING"
                    ? "bg-orange-50 border-orange-200"
                    : "bg-purple-50 border-purple-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock
                    className={`h-5 w-5 ${
                      selectedShift === "MORNING"
                        ? "text-orange-600"
                        : "text-purple-600"
                    }`}
                  />

                  <span className="font-medium">
                    {tripInfo?.rotute?.startTime
                      ? new Date(tripInfo.rotute.startTime).toLocaleTimeString(
                          "vi-VN",
                          { hour: "2-digit", minute: "2-digit" }
                        )
                      : "---"}
                  </span>
                </div>

                <MapPin
                  className={`h-5 w-5 ${
                    selectedShift === "MORNING"
                      ? "text-orange-600"
                      : "text-purple-600"
                  }`}
                />
              </div>

              {/* STOPS */}
              {scheduleLoading || tripLoading ? (
                <p className="text-gray-500">Đang tải dữ liệu...</p>
              ) : (
                <div className="space-y-4">
                  {pickupPoints.map((stop, index) => (
                    <div
                      key={stop.id}
                      onClick={() => setSelectedTrip(stop)}
                      className={`cursor-pointer rounded-xl transition border ${
                        selectedTrip?.id === stop.id
                          ? selectedShift === "MORNING"
                            ? "bg-orange-100 border-orange-300 shadow"
                            : "bg-purple-100 border-purple-300 shadow"
                          : "border-transparent hover:bg-gray-50"
                      }`}
                    >
                      <TripCard
                        index={index + 1}
                        location={stop.name}
                        time="---"
                        students={[]}
                        onPickUp={handlePickUp}
                        onAbsent={handleAbsent}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            <QuickInfoSidebar
              electricCount={3}
              studyCount={4}
              WorkCount={schedules.length}
              routeInfo={{
                vehicle: "Xe buýt",
                vehicleId: tripInfo?.bus?.licensePlate ?? "---",
                pickupPoint: selectedTrip?.name ?? "---",
                dropPoint: "---",
                time: tripInfo?.rotute?.startTime
                  ? new Date(tripInfo.rotute.startTime).toLocaleTimeString(
                      "vi-VN",
                      { hour: "2-digit", minute: "2-digit" }
                    )
                  : "---",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
