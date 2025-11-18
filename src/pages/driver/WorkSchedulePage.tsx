import React from "react";
import { WelcomeBanner } from "../../components/uiPart/WelcomeBanner";
import { TripCard } from "../../components/uiPart/TripCard";
import { QuickInfoSidebar } from "../../components/uiPart/QuickInfoSidebar";
import { Card } from "../../components/uiItem/card";
import { toast } from "sonner";
import { Clock, MapPin, Sun, Sunset } from "lucide-react";
import type { Student } from "../../components/uiPart/TripCard";

interface TripInfo {
  id: number;
  location: string;
  time: string;
  students: Student[];
  dropPoint: string;
}

export const WorkSchedulePage: React.FC = () => {
  // Danh sách ca
  const schedules = [
    {
      id: 1,
      type: "morning" as const,
      label: "Ca sáng",
      timeRange: "06:45 - 08:00",
      pickupPoints: [
        {
          id: 1,
          location: "Bến xe Bến Thành",
          time: "07:00",
          dropPoint: "Trường THCS ABC",
          students: [{ name: "Nguyễn Minh Khang", className: "6A" }],
        },
        {
          id: 2,
          location: "Công viên 23/9",
          time: "07:10",
          dropPoint: "Trường THCS XYZ",
          students: [{ name: "Lê Thị Mai", className: "7B" }],
        },
      ] as TripInfo[],
    },
    {
      id: 2,
      type: "afternoon" as const,
      label: "Ca chiều",
      timeRange: "16:45 - 18:00",
      pickupPoints: [
        {
          id: 1,
          location: "Trường THCS ABC",
          time: "17:00",
          dropPoint: "Bến xe Bến Thành",
          students: [
            { name: "Nguyễn Minh Khang", className: "6A" },
            { name: "Lê Thị Mai", className: "7B" },
          ],
        },
      ] as TripInfo[],
    },
  ];

  // State ca
  const [selectedShift, setSelectedShift] =
    React.useState<"morning" | "afternoon">("morning");

  // State chuyến (Trip)
  const [selectedTrip, setSelectedTrip] = React.useState<TripInfo | null>(null);

  // Tìm ca hiện tại
  const currentShift = schedules.find((s) => s.type === selectedShift);

  const handlePickUp = (student: Student) =>
    toast.success(`✅ Đã đón ${student.name}`);
  const handleAbsent = (student: Student) =>
    toast.info(`📋 ${student.name} vắng mặt`);

  return (
    <div className="p-6">
      <div className="space-y-6">

        <WelcomeBanner
          driverName="Nguyễn Thành Luân"
          vehicleId="Xe buýt: 50A-1245"
          date={new Date().toLocaleDateString("vi-VN")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAIN SECTION */}
          <div className="lg:col-span-2 space-y-6">

            {/* Chọn Ca */}
            <div className="flex gap-3 mb-2">
              <button
                onClick={() => {
                  setSelectedShift("morning");
                  setSelectedTrip(null);
                }}
                className={`px-4 py-2 rounded-lg border font-medium cursor-pointer ${selectedShift === "morning"
                    ? "bg-orange-500 text-white border-orange-600"
                    : "bg-white text-gray-700"
                  }`}
              >
                Ca sáng
              </button>

              <button
                onClick={() => {
                  setSelectedShift("afternoon");
                  setSelectedTrip(null);
                }}
                className={`px-4 py-2 rounded-lg border font-medium cursor-pointer ${selectedShift === "afternoon"
                    ? "bg-purple-600 text-white border-purple-700"
                    : "bg-white text-gray-700"
                  }`}
              >
                Ca chiều
              </button>
            </div>

            {/* Card Ca */}
            {currentShift && (
              <Card className="p-5">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  {currentShift.type === "morning" ? (
                    <Sun className="w-5 h-5 text-orange-500" />
                  ) : (
                    <Sunset className="w-5 h-5 text-purple-500" />
                  )}

                  <span>Lịch làm việc hôm nay - {currentShift.label}</span>
                </h2>

                {/* Thông tin Ca */}
                <div
                  className={`flex justify-between p-4 rounded-lg border mb-5 ${currentShift.type === "morning"
                      ? "bg-orange-50 border-orange-200"
                      : "bg-purple-50 border-purple-200"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock
                      className={`h-5 w-5 ${currentShift.type === "morning"
                          ? "text-orange-600"
                          : "text-purple-600"
                        }`}
                    />
                    <span className="font-medium">{currentShift.timeRange}</span>
                  </div>

                  <MapPin
                    className={`h-5 w-5 ${currentShift.type === "morning"
                        ? "text-orange-600"
                        : "text-purple-600"
                      }`}
                  />
                </div>

                {/* Danh sách chuyến */}
                <div className="space-y-4">
                  {currentShift.pickupPoints.map((point, index) => (
                    <div
                      key={point.id}
                      onClick={() => setSelectedTrip(point)}
                      className={`cursor-pointer rounded-xl transition border ${selectedTrip?.id === point.id
                          ? currentShift.type === "morning"
                            ? "bg-orange-100 border-orange-300 shadow"
                            : "bg-purple-100 border-purple-300 shadow"
                          : "border-transparent hover:bg-gray-50"
                        }`}
                    >
                      <TripCard
                        index={index + 1}
                        location={point.location}
                        time={point.time}
                        students={point.students}
                        onPickUp={handlePickUp}
                        onAbsent={handleAbsent}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Thông tin nhanh */}
          <div className="lg:col-span-1 space-y-6">
            <QuickInfoSidebar
              electricCount={3}
              studyCount={4}
              WorkCount={schedules.length}
              routeInfo={{
                vehicle: "Xe buýt",
                vehicleId: "50A-1245",

                pickupPoint: selectedTrip?.location ?? "---",
                dropPoint: selectedTrip?.dropPoint ?? "---",
                time: selectedTrip?.time ?? "---",
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
