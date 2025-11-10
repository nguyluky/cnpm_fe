import React, { useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
// import { Button } from "../../components/uiItem/button";
import { CalendarDays } from "lucide-react";

interface Shift {
  id: number;
  date: string;
  timeRange: string;
  route: string;
  school: string;
  driver: string;
  shiftType: "morning" | "afternoon";
}

export const WorkOverviewPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // ✅ Dữ liệu mẫu bọc trong useMemo để tránh re-render
  const shifts: Shift[] = useMemo(
    () => [
      { id: 1, date: "2025-10-21", timeRange: "06:45 - 08:00", route: "Tuyến 1 - Quận 1", school: "THCS ABC", driver: "Nguyễn Văn A", shiftType: "morning" },
      { id: 2, date: "2025-10-21", timeRange: "16:45 - 18:00", route: "Tuyến 1 - Quận 1", school: "THCS ABC", driver: "Nguyễn Văn A", shiftType: "afternoon" },
      { id: 3, date: "2025-10-22", timeRange: "07:00 - 08:15", route: "Tuyến 2 - Quận 3", school: "THCS XYZ", driver: "Nguyễn Văn A", shiftType: "morning" },
      { id: 4, date: "2025-10-23", timeRange: "16:30 - 17:45", route: "Tuyến 3 - Quận 5", school: "THCS Minh Khai", driver: "Nguyễn Văn A", shiftType: "afternoon" },
      { id: 5, date: "2025-10-24", timeRange: "06:45 - 08:00", route: "Tuyến 1 - Quận 1", school: "THCS ABC", driver: "Nguyễn Văn A", shiftType: "morning" },
    ],
    []
  );

  // ✅ Chuyển shift → event (phụ thuộc shifts)
  const events = useMemo(() => {
    return shifts.map((shift) => {
      const [startHour, startMinute] = shift.timeRange.split(" - ")[0].split(":");
      const [endHour, endMinute] = shift.timeRange.split(" - ")[1].split(":");

      return {
        id: shift.id.toString(),
        title: `${shift.school} (${shift.route})`,
        start: `${shift.date}T${startHour}:${startMinute}:00`,
        end: `${shift.date}T${endHour}:${endMinute}:00`,
        backgroundColor: shift.shiftType === "morning" ? "#FEF3C7" : "#EDE9FE",
        borderColor: shift.shiftType === "morning" ? "#FBBF24" : "#8B5CF6",
        textColor: "#1E1E1E",
      };
    });
  }, [shifts]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <CalendarDays className="text-purple-600" />
          Lịch làm việc tổng quan
        </h1>
{/* 
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
          >
            ◀ Tuần trước
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
          >
            Tuần sau ▶
          </Button>
        </div> */}
      </div>

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
