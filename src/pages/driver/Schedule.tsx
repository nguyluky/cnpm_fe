import React from "react";
import { Badge } from "../../components/uiItem/badge";
import { Card } from "../../components/uiItem/card";
import { useApi } from "../../contexts/apiConetxt";
import { useQuery } from "@tanstack/react-query";

// Kiểu dữ liệu mẫu
interface ApiSchedule {
  id: string;                           // scheduleId
  route: { id: string; name: string };
  bus: { licensePlate: string; model: string; capacity: number };
  type: "MORNING" | "AFTERNOON";
  daysOfWeek: number[];
  startDate: string;
  endDate: string;
  status: string;
}

interface TodaySchedule {
  scheduleId: string;
  tripId: string;
  date: string;       // ngày thực tế
  status: string;     // ACTIVE,...
  type: "DISPATH" | "RETURN";
  startTime: string;
}

function getDaysOfWeekText(days: number[]) {
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return days.map((day) => dayNames[day]).join(", ");
}

function getScheduleTypeColor(type: string) {
  return type === "MORNING"
    ? "bg-orange-50 text-orange-600 border-orange-300"
    : "bg-purple-50 text-purple-600 border-purple-300";
}

export default function DriverSchedule() {
  const api = useApi();

  // Lấy tất cả lịch xe đã phân, route, bus...
  const { data: schedules, error, isLoading } = useQuery({
    queryKey: ["driverSchedules"],
    queryFn: async () => {
      const result = await api.api.getDriverSchedules();
      const d = typeof result.json === "function" ? await result.json() : result;
      if (d.code !== 200 || !d.data?.data) throw new Error(d.message || "API lỗi");
      return d.data.data;
    },
  });

  // Lấy các ca hôm nay, gồm scheduleId và thông tin ca trong ngày
  const { data: todaySchedules, error: errorToday, isLoading: isTodayLoading } = useQuery({
    queryKey: ["todaysSchedules"],
    queryFn: async () => {
      const result = await api.api.getTodaysSchedules();
      const d = typeof result.json === "function" ? await result.json() : result;
      if (d.code !== 200 || !d.data?.data) throw new Error(d.message || "API lỗi");
      return d.data.data;
    },
  });

  // Map dữ liệu lịch hôm nay với lịch đầy đủ
  const overviewSchedules = (todaySchedules || []).map((today) => {
    const full = (schedules || []).find((sch) => sch.id === today.scheduleId);
    return {
      ...full,
      ...today,
      route: full?.route ?? { name: "---" },
      bus: full?.bus ?? { licensePlate: "---", model: "---", capacity: "---" },
      type: full?.type ?? "MORNING"
    };
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Tổng quan lịch trình hôm nay</h1>
        <p className="text-gray-600">Các ca, tuyến, thông tin xe đầy đủ.</p>
      </div>

      {(isLoading || isTodayLoading) && <p>Đang tải dữ liệu...</p>}
      {(error || errorToday) && (
        <Card className="p-8 text-center text-red-500">
          Lỗi API: {error?.message || errorToday?.message}
        </Card>
      )}

      <div className="space-y-6">
        {overviewSchedules.map((schedule) => (
          <Card key={schedule.scheduleId || schedule.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{schedule.route.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <Badge className={`px-4 py-1 rounded-full border font-semibold ${getScheduleTypeColor(schedule.type)}`}>
                      {schedule.type === "MORNING" ? "Ca sáng" : "Ca chiều"}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Ngày trong tuần: {getDaysOfWeekText(schedule.daysOfWeek ?? [])}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Giờ bắt đầu: {schedule.startTime ?? (schedule.startDate ? new Date(schedule.startDate).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "---")}</p>
                    <p>Ngày làm việc: {schedule.date ?? (schedule.startDate ? new Date(schedule.startDate).toLocaleDateString("vi-VN") : "---")}</p>
                    <p>Ngày kết thúc: {schedule.endDate ? new Date(schedule.endDate).toLocaleDateString("vi-VN") : "---"}</p>
                    <p>Trạng thái: {schedule.status || "---"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3">Thông tin xe</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Biển số:</span>
                  <span className="ml-2 font-medium">{schedule.bus.licensePlate}</span>
                </div>
                <div>
                  <span className="text-gray-600">Loại xe:</span>
                  <span className="ml-2">{schedule.bus.model}</span>
                </div>
                <div>
                  <span className="text-gray-600">Sức chứa:</span>
                  <span className="ml-2">{schedule.bus.capacity} chỗ</span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {overviewSchedules.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              <p className="text-lg mb-2">Chưa có lịch trình nào cho hôm nay</p>
              <p className="text-sm">Liên hệ quản lý để được phân lịch</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
