import React, { useState } from "react";
import { Button } from "../../components/uiItem/button";
import { Plus } from "lucide-react";
import { Calendar } from "lucide-react";
import { Clock } from "lucide-react";

export const Schedules = () => {
  const [selectedDate, setSelectedDate] = useState("10/10/2025");

  const schedules = [
    {
      time: "Ca sáng (06:45 - 08:00)",
      buses: [
        { licensePlate: "29A-12345", driver: "Nguyễn Văn A", route: "Tuyến 1 - Quận 1", startTime: "06:45", endTime: "08:00"},
        { licensePlate: "29B-67890", driver: "Nguyễn Văn B", route: "Tuyến 2 - Quận 3", startTime:  "06:45", endTime: "08:00"},
      ],
    },
    {
      time: "Ca chiều (16:45 - 18:00)",
      buses: [
        { licensePlate: "29A-12345", driver: "Nguyễn Văn A", route: "Tuyến 1 - Quận 1", startTime: "16:45",endTime: "18:00" },
      ],
    },
  ];

  const weeklySummary = [
    { day: "Thứ 2", trips: 6 },
    { day: "Thứ 3", trips: 6 },
    { day: "Thứ 4", trips: 6 },
    { day: "Thứ 5", trips: 6 },
    { day: "Thứ 6", trips: 6 },
    { day: "Thứ 7", trips: 0 },
    { day: "Chủ nhật", trips: 0 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
        <div className="flex justify-between items-center mb-6">
        {/* Tiêu đề và mô tả */}
        <div>
            <h2 className="text-lg font-semibold ">Lịch trình xe Bus</h2>
            <span className="text-gray-600 text-sm">Quản lý và phân công lịch trình</span>
        </div>

        {/* Nút tạo lịch */}
        <Button variant="default" className="bg-indigo-500 text-white flex items-center w-50 h-10">
            <Plus className="mr-2" size={18} /> Tạo lịch mới
        </Button>
        </div>


      {/* Schedule Section */}
      <div className="bg-white rounded-lg shadow px-8 border border-blue-200 text-sm">
        <div className="flex justify-between items-center mb-4">
         <span className="text-gray-600 text-sm font-semibold">Lịch trình ngày</span>
            <div className="relative">
            <input
                type="text"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-11 w-32 border rounded-lg pl-3 pr-10 mt-4"
                placeholder="Chọn ngày"
            />
            <Calendar
                size={18}
                className="absolute right-3 top-1/2"
            />
            </div>
        </div>

{schedules.map((shift, index) => (
  <div key={index} className="mb-4">
<div
  className={`flex items-center mb-2 font-semibold`}
>
  {/* Icon đồng hồ bên trái */}
  <Clock
    className={`w-5 h-5 mr-2 ${
      index === 0 ? "text-red-500" : "text-blue-500"
    }`}
  />

  {/* Chữ thời gian */}
  <span>{shift.time}</span>
</div>

    {shift.buses.map((bus, busIndex) => (
        <div className="flex items-center justify-between p-2 border rounded-lg mb-2 bg-gray-50">
        <div className="flex items-center gap-3">
        {/* Card nhỏ hiển thị mã 29A */}
            <div
            className={`text-white font-bold px-3 py-2 rounded-lg shadow-sm w-13 h-10 flex items-center justify-center`}
            style={{
                backgroundColor:
                 parseInt(bus.endTime.split(":")[0], 10) < 12 ? "#656BEB" : "#9536C2", // < 12h sáng, >= 12h chiều
            }}
            >
            {bus.licensePlate.split("-")[0]}
            </div>


        {/* Biển số đầy đủ */}
        <div className="flex flex-col  justify-center  gap-1">
        <span className="text-gray-700 font-semibold">{bus.licensePlate}</span>
        <span className="text-gray-600">{bus.route}</span>
         </div>
        </div>


        {/* Cụm bên phải */}
        <div className="flex flex-col items-center justify-center w-1/3 gap-1">
            <span className="mr-2 text-gray-700 font-semibold">{bus.driver}</span>
            <span className="text-gray-500">{bus.startTime} - {bus.endTime}</span>
        </div>

        <button className="ml-4 bg-[#D3FDCB] text-[#38B769] px-2 py-1 rounded-lg font-semibold">
        Đã lên lịch
        </button>

        </div>

    ))}
  </div>
))}

      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-lg shadow p-4 border border-blue-200 mt-4 text-sm">
        <h3 className="text-lg font-semibold mb-4">Tổng quan tuần</h3>
        <div className="grid grid-cols-7 gap-4">
          {weeklySummary.map((day, index) => (
            <div key={index} className="text-center p-2 border rounded-lg bg-gray-50">
              <span className="block font-semibold">{day.day}</span>
              <span className="block text-[#656BEB] font-bold text-lg">{day.trips}</span>
              <span className="block">chuyến</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};