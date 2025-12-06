import React, { useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { CalendarDays } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../contexts/apiConetxt";

interface ApiSchedule {
  id: string;
  route: { id: string; name: string };
  bus: { id: string; licensePlate: string };
  type: "MORNING" | "AFTERNOON";
  daysOfWeek: number[]; // 1–7
  startTime: string; // "06:30"
  startDate: string; // ISO
  endDate: string; // ISO
}

export const DriverSchedule: React.FC = () => {
  const api = useApi();
  const [currentDate, _] = useState(new Date());

  const { data: schedules = [], isLoading, error } = useQuery<ApiSchedule[]>({
    queryKey: ["driverSchedules-calendar"],
    queryFn: async () => {
      const res = await api.api.getDriverSchedules();
      const json = typeof (res as any).json === "function" ? await (res as any).json() : res;
      if (json.code !== 200 || !json.data?.data) {
        throw new Error(json.message || "API getDriverSchedules lỗi hoặc rỗng");
      }
      return json.data.data as ApiSchedule[];
    },
  });

  // util: parse ISO date "2025-11-01T00:00:00.000Z" -> Date (local, bỏ time)
  const toLocalDateOnly = (iso: string) => {
    const d = new Date(iso);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  // util: lặp qua từng ngày từ start tới end
  const eachDay = (start: Date, end: Date): Date[] => {
    const days: Date[] = [];
    const cur = new Date(start.getTime());
    while (cur <= end) {
      days.push(new Date(cur.getTime()));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  };

  // util: convert daysOfWeek (1–7) -> set dễ check
  const buildDaysOfWeekSet = (days: number[]) => new Set(days);

  // util: build time string "YYYY-MM-DDTHH:mm:ss"
  const buildDateTime = (date: Date, timeHHmm: string) => {
    const [h, m] = timeHHmm.split(":");
    const yyyy = date.getFullYear();
    const mm = `${date.getMonth() + 1}`.padStart(2, "0");
    const dd = `${date.getDate()}`.padStart(2, "0");
    const hh = h.padStart(2, "0");
    const mi = m.padStart(2, "0");
    // ví dụ hiển thị 1 giờ, có thể cộng thêm 1h nếu muốn
    return {
      start: `${yyyy}-${mm}-${dd}T${hh}:${mi}:00`,
      end: `${yyyy}-${mm}-${dd}T${hh}:${mi}:00`,
    };
  };

  const events = useMemo(() => {
    if (!schedules.length) return [];

    const allEvents: any[] = [];

    schedules.forEach((sch) => {
      const startDate = toLocalDateOnly(sch.startDate);
      const endDate = toLocalDateOnly(sch.endDate);
      const daysSet = buildDaysOfWeekSet(sch.daysOfWeek); // 1–7

      const days = eachDay(startDate, endDate);

      days.forEach((day) => {
        // JS: 0–6 (CN–T7) => API: 1–7 (T2–CN)
        const jsDay = day.getDay(); // 0–6
        const apiDay = jsDay === 0 ? 7 : jsDay; // đổi 0->7, còn lại giữ nguyên

        if (!daysSet.has(apiDay)) return;

        const { start, end } = buildDateTime(day, sch.startTime);

        allEvents.push({
          id: `${sch.id}-${start}`,
          title: sch.route.name, // chỉ cần tên tuyến
          start,
          end,
          backgroundColor: sch.type === "MORNING" ? "#FEF3C7" : "#EDE9FE",
          borderColor: sch.type === "MORNING" ? "#FBBF24" : "#8B5CF6",
          textColor: "#1E1E1E",
        });
      });
    });

    return allEvents;
  }, [schedules]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <CalendarDays className="text-purple-600" />
          Lịch làm việc tổng quan
        </h1>
      </div>

      {isLoading && <p>Đang tải lịch làm việc...</p>}
      {error && <p className="text-red-500">Lỗi tải lịch: {(error as Error).message}</p>}

      {/* Lịch */}
      <div className="bg-white rounded-xl shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={viLocale}
          nowIndicator
          events={events}
          height="80vh"
          slotMinTime="05:00:00"
          slotMaxTime="19:00:00"
          allDaySlot={false}
          initialDate={currentDate}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Hôm nay",
            month: "Tháng",
            week: "Tuần",
            day: "Ngày",
          }}
          eventContent={(arg) => (
            <div className="p-1">
              <div className="font-semibold text-sm">{arg.event.title}</div>
              <div className="text-xs text-slate-600">{arg.timeText}</div>
            </div>
          )}
        />
      </div>
    </div>
  );
};
