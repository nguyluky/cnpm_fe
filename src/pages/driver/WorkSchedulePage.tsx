import React from "react";
import { WelcomeBanner } from "../../components/uiPart/WelcomeBanner";
import { TripCard } from "../../components/uiPart/TripCard";
import { QuickInfoSidebar } from "../../components/uiPart/QuickInfoSidebar";
import { Card } from "../../components/uiItem/card";
import { toast } from "sonner";
import { Clock, MapPin, Sun, Sunset } from "lucide-react";
import type { Student } from "../../components/uiPart/TripCard";

export const WorkSchedulePage: React.FC = () => {
  // Danh sách ca làm việc hôm nay
  const schedules = [
    {
      id: 1,
      type: "morning",
      label: "Ca sáng",
      timeRange: "06:45 - 08:00",
      route: "Tuyến 1 - Quận 1",
      pickupPoints: [
        {
          id: 1,
          location: "Bến xe Bến Thành",
          time: "07:00",
          students: [
            { name: "Nguyễn Minh Khang", className: "6A" },
          ] as Student[],
        },
        {
          id: 2,
          location: "Công viên 23/9",
          time: "07:10",
          students: [
            { name: "Lê Thị Mai", className: "7B" },
          ] as Student[],
        },
      ],
    },
    {
      id: 2,
      type: "afternoon",
      label: "Ca chiều",
      timeRange: "16:45 - 18:00",
      route: "Tuyến 1 - Quận 1",
      pickupPoints: [
        {
          id: 1,
          location: "Trường THCS ABC",
          time: "17:00",
          students: [
            { name: "Nguyễn Minh Khang", className: "6A" },
            { name: "Lê Thị Mai", className: "7B" },
          ] as Student[],
        },
      ],
    },
  ];

  // Xử lý sự kiện
  const handlePickUp = (student: Student) =>
    toast.success(`✅ Đã đón ${student.name}`);
  const handleAbsent = (student: Student) =>
    toast.info(`📋 ${student.name} vắng mặt`);

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Banner chào mừng */}
        <WelcomeBanner
          driverName="Nguyễn Văn A"
          vehicleId="Xe buýt: 50A-1245"
          date={new Date().toLocaleDateString("vi-VN")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Khu vực chính */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lặp qua từng ca */}
            {schedules.map((shift) => (
              <Card key={shift.id} className="p-5">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  {shift.type === "morning" ? (
                    <Sun className="w-5 h-5 text-orange-500" />
                  ) : (
                    <Sunset className="w-5 h-5 text-purple-500" />
                  )}
                  <span>
                    Lịch làm việc hôm nay - {shift.label}
                  </span>
                </h2>

                {/* Thông tin ca */}
                <div
                  className={`flex justify-between p-4 rounded-lg border mb-5 ${
                    shift.type === "morning"
                      ? "bg-orange-50 border-orange-200"
                      : "bg-purple-50 border-purple-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock
                      className={`h-5 w-5 ${
                        shift.type === "morning"
                          ? "text-orange-600"
                          : "text-purple-600"
                      }`}
                    />
                    <span className="font-medium text-gray-800">
                      {shift.timeRange}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin
                      className={`h-5 w-5 ${
                        shift.type === "morning"
                          ? "text-blue-600"
                          : "text-purple-600"
                      }`}
                    />
                    <span>{shift.route}</span>
                  </div>
                </div>

                {/* Danh sách điểm đón */}
                <div className="space-y-4">
                  {shift.pickupPoints.map((point, index) => (
                    <TripCard
                      key={point.id}
                      index={index + 1}
                      location={point.location}
                      time={point.time}
                      students={point.students}
                      onPickUp={handlePickUp}
                      onAbsent={handleAbsent}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar thông tin nhanh */}
          <div className="lg:col-span-1 space-y-6">
            <QuickInfoSidebar
              electricCount={2}
              studyCount={4}
              routeInfo={{
                vehicle: "Xe buýt",
                route: "Tuyến 1 - Quận 1",
                vehicleId: "50A-1245",
                time: "06:45 - 08:00",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
