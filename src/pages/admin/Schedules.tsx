import React, { useState, useMemo } from "react";
import { Button } from "../../components/uiItem/button";
import { Plus, Calendar, Clock } from "lucide-react";
import Select from 'react-select';
import { vi } from 'date-fns/locale';
import { format, startOfWeek, addDays, getDay } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Dữ liệu tham chiếu
const busOptions = [
  { value: 'bus_001', label: '29A-12345 - Trần Văn A' },
  { value: 'bus_002', label: '29B-67890 - Nguyễn Thị B' },
];

const routeOptions = [
  { value: 'route_01', label: 'Tuyến 01 - Bến Thành → Chợ Lớn' },
  { value: 'route_02', label: 'Tuyến 52 - Bến Xe Miền Tây → Đại học Quốc Gia' },
];

const driverOptions = [
  { value: 'driver_001', label: 'Nguyễn Văn An (A12345)' },
  { value: 'driver_002', label: 'Trần Thị Bé (B67890)' },
];

// Dữ liệu lịch trình từ DB
const schedulesFromDB = [
  {
    id: "sch_001",
    routeId: "route_01",
    busId: "bus_001",
    driverId: "driver_001",
    type: "MORNING" as const,
    daysOfWeek: [1, 2, 3, 4, 5],
    startTime: "06:45:00",
    startDate: "2025-11-01",
    endDate: null,
    status: "ACTIVE" as const,
  },
  {
    id: "sch_002",
    routeId: "route_02",
    busId: "bus_002",
    driverId: "driver_002",
    type: "MORNING" as const,
    daysOfWeek: [1, 2, 3, 4, 5, 6],
    startTime: "06:45:00",
    startDate: "2025-11-01",
    endDate: "2025-12-31",
    status: "ACTIVE" as const,
  },
  {
    id: "sch_003",
    routeId: "route_01",
    busId: "bus_001",
    driverId: "driver_001",
    type: "AFTERNOON" as const,
    daysOfWeek: [1, 1, 2, 3, 4, 5],
    startTime: "16:45:00",
    startDate: "2025-11-01",
    endDate: null,
    status: "ACTIVE" as const,
  },
];

// Hàm lấy tuần bắt đầu từ Thứ 2
const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

// Kiểm tra lịch có hoạt động trong ngày không
const isScheduleActiveOnDate = (sch: any, date: Date): boolean => {
  if (sch.status !== "ACTIVE") return false;
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayOfWeek = getDay(date) || 7; // CN = 7

  return (
    sch.daysOfWeek.includes(dayOfWeek) &&
    dateStr >= sch.startDate &&
    (!sch.endDate || dateStr <= sch.endDate)
  );
};

// Tính số chuyến mỗi ngày trong tuần
const getWeeklySummary = (dateInWeek: Date) => {
  const days = getWeekDays(dateInWeek);
  return days.map(date => {
    const count = schedulesFromDB.filter(sch => isScheduleActiveOnDate(sch, date)).length;
    return {
      date,
      dayName: format(date, 'EEEE', { locale: vi }),
      dayShort: format(date, 'dd/MM'),
      tripCount: count,
    };
  });
};

export const Schedules = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const formatDateDisplay = (date: Date) => {
    return format(date, 'EEEE, dd/MM/yyyy', { locale: vi });
  };

  // Lấy lịch của ngày được chọn
  const getSchedulesForDate = (date: Date) => {
    const dayOfWeek = date.getDay() || 7;
    const dateStr = format(date, 'yyyy-MM-dd');

    return schedulesFromDB
      .filter(s => {
        const inRange = dateStr >= s.startDate && (!s.endDate || dateStr <= s.endDate);
        const inWeekDay = s.daysOfWeek.includes(dayOfWeek);
        return s.status === "ACTIVE" && inRange && inWeekDay;
      })
      .map(s => ({
        id: s.id,
        busId: s.busId,
        licensePlate: busOptions.find(b => b.value === s.busId)?.label.split(" - ")[0] || "N/A",
        driver: driverOptions.find(d => d.value === s.driverId)?.label.split(" (")[0] || "N/A",
        route: routeOptions.find(r => r.value === s.routeId)?.label || "N/A",
        startTime: s.startTime.slice(0, 5),
        endTime: s.type === "MORNING" ? "08:00" : "18:00",
        type: s.type,
        shiftName: s.type === "MORNING" ? "Ca sáng (06:45 - 08:00)" : "Ca chiều (16:45 - 18:00)",
      }));
  };

  const todaySchedules = getSchedulesForDate(selectedDate);
  const morningSchedules = todaySchedules.filter(s => s.type === "MORNING");
  const afternoonSchedules = todaySchedules.filter(s => s.type === "AFTERNOON");

  // Tính tổng quan tuần (tự động cập nhật khi đổi ngày)
  const weeklySummary = useMemo(() => getWeeklySummary(selectedDate), [selectedDate]);

  const totalTripsThisWeek = weeklySummary.reduce((sum, day) => sum + day.tripCount, 0);

return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Lịch trình xe Bus</h2>
          <span className="text-gray-600 text-sm">Quản lý và phân công lịch trình</span>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 text-white flex items-center h-10 px-4 rounded-lg hover:bg-indigo-700"
        >
          <Plus className="mr-2" size={18} /> Tạo lịch mới
        </Button>
      </div>

      {/* Modal tạo lịch */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-8">Tạo lịch trình mới</h3>
            {isCreateModalOpen && (
            <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-8">Tạo lịch trình mới</h3>

                <form onSubmit={(e) => { e.preventDefault(); /* handle submit */ }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cột trái */}
                    <div className="space-y-6">
                      {/* Xe buýt - Tìm kiếm */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Xe buýt <span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={busOptions}
                          placeholder="Tìm kiếm biển số hoặc tài xế phụ..."
                          isSearchable
                          required
                          className="text-sm"
                          classNamePrefix="react-select"
                          noOptionsMessage={() => "Không tìm thấy xe buýt"}
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: '#d1d5db',
                              borderRadius: '0.5rem',
                              padding: '0.25rem',
                              '&:hover': { borderColor: '#818cf8' },
                            }),
                          }}
                        />
                      </div>

                      {/* Tuyến đường - Tìm kiếm */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tuyến đường <span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={routeOptions}
                          placeholder="Nhập tên tuyến, số tuyến..."
                          isSearchable
                          required
                          className="text-sm"
                          classNamePrefix="react-select"
                          noOptionsMessage={() => "Không tìm thấy tuyến đường"}
                        />
                      </div>

                      {/* Tài xế - Tìm kiếm */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tài xế <span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={driverOptions}
                          placeholder="Nhập tên hoặc mã tài xế..."
                          isSearchable
                          required
                          className="text-sm"
                          classNamePrefix="react-select"
                          noOptionsMessage={() => "Không tìm thấy tài xế"}
                        />
                      </div>

                      {/* Ca làm việc */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ca làm việc <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        >
                          <option value="">Chọn ca</option>
                          <option value="MORNING">Ca sáng</option>
                          <option value="AFTERNOON">Ca chiều</option>
                        </select>
                      </div>

                      {/* Giờ bắt đầu */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Giờ bắt đầu <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Cột phải - giữ nguyên như cũ */}
                    <div className="space-y-6">
                      {/* Các ngày trong tuần */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Các thứ trong tuần <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => (
                            <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                              <input type="checkbox" value={idx + 1} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                              <span className="text-sm font-medium">{day}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Các trường còn lại giữ nguyên */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày bắt đầu <span className="text-red-500">*</span></label>
                        <input type="date" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày kết thúc (tùy chọn)</label>
                        <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                        <select defaultValue="ACTIVE" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                          <option value="ACTIVE">Hoạt động</option>
                          <option value="INACTIVE">Tạm dừng</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú bổ sung</label>
                        <textarea rows={3} placeholder="Lịch đặc biệt, xe thay thế,..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-10">
                    <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
                      Hủy
                    </button>
                    <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-lg">
                      Tạo lịch trình
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
            <div className="flex justify-end gap-4 mt-10">
              <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
                Hủy
              </button>
              <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-lg">
                Tạo lịch trình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Section */}
      <div className="bg-white rounded-lg shadow px-8 py-6 border border-blue-200">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-700 text-base font-semibold">Lịch trình ngày</span>

          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date as Date)}
              dateFormat="dd/MM/yyyy"
              locale={vi}
              todayButton="Hôm nay"
              customInput={
                <div className="relative cursor-pointer">
                  <input
                    type="text"
                    readOnly
                    value={formatDateDisplay(selectedDate)}
                    className="h-12 w-64 px-4 pr-12 border border-gray-300 rounded-lg bg-white text-gray-800 font-medium text-sm hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer transition-all select-none"
                    placeholder="Chọn ngày"
                  />
                  <Calendar size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              }
              popperClassName="z-50"
            />
          </div>
        </div>

        {/* <div className="text-sm text-gray-600 mb-6">
          Đang hiển thị lịch trình của:{' '}
          <span className="font-semibold text-indigo-600">{formatDateDisplay(selectedDate)}</span>
          {' '}({todaySchedules.length} xe hoạt động)
        </div> */}

        {/* Danh sách ca làm việc */}
        {[
          { type: "MORNING", data: morningSchedules, label: "Ca sáng (06:45 - 08:00)", color: "#656BEB" },
          { type: "AFTERNOON", data: afternoonSchedules, label: "Ca chiều (16:45 - 18:00)", color: "#9536C2" },
        ].map(shift => shift.data.length > 0 && (
          <div key={shift.type} className="mb-8">
            <div className="flex items-center mb-4 font-semibold text-gray-800">
              <Clock className="w-5 h-5 mr-2" style={{ color: shift.type === "MORNING" ? "#dc2626" : "#2563eb" }} />
              <span>{shift.label}</span>
              <span className="ml-3 text-sm text-gray-500">({shift.data.length} xe)</span>
            </div>

            {shift.data.map((bus: any) => (
              <div key={bus.id} className="flex items-center justify-between p-4 border rounded-lg mb-3 bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex items-center gap-4">
                  <div
                    className="text-white font-bold px-4 py-2 rounded-lg shadow-sm flex items-center justify-center min-w-28"
                    style={{ backgroundColor: shift.color }}
                  >
                    {bus.licensePlate.split("-")[0]}
                  </div>

                  <div>
                    <div className="font-semibold text-gray-800">{bus.licensePlate}</div>
                    <div className="text-sm text-gray-600">{bus.route}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium text-gray-700">{bus.driver}</div>
                  <div className="text-sm text-gray-500">{bus.startTime} - {bus.endTime}</div>
                </div>

                <button className="ml-4 bg-[#D3FDCB] text-[#38B769] px-4 py-2 rounded-lg font-medium text-sm">
                  Đã lên lịch
                </button>
              </div>
            ))}
          </div>
        ))}

        {todaySchedules.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Không có lịch trình nào trong ngày này</p>
            <p className="text-sm mt-2">Hãy chọn ngày khác hoặc tạo lịch mới</p>
          </div>
        )}
      </div>

      {/* TỔNG QUAN TUẦN - ĐẸP & CHÍNH XÁC 100% */}
      <div className="bg-white rounded-lg shadow p-6 border border-blue-200 mt-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8 mb-8">
          Tổng quan tuần ({format(weeklySummary[0].date, 'dd/MM', { locale: vi })} - {format(weeklySummary[6].date, 'dd/MM', { locale: vi })})
        </h3>

        <div className="grid grid-cols-7 gap-5 mb-8">
          {weeklySummary.map((day, idx) => (
            <div
              key={idx}
              className={`text-center p-6 rounded-2xl shadow-md transition-all hover:scale-105 ${
                day.tripCount > 0 ? 'bg-white border-2 border-indigo-300' : 'bg-gray-100 opacity-70'
              }`}
            >
              <p className="text-sm font-bold text-gray-600">
                {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"][idx]}
              </p>
              <p className="text-4xl font-extrabold text-indigo-600 my-3">
                {day.tripCount}
              </p>
              <p className="text-xs text-gray-500">{day.dayShort}</p>
              <p className="text-sm text-gray-600 mt-1">chuyến</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Tổng cộng tuần này:{' '}
            <span className="text-4xl font-bold text-indigo-600">
              {totalTripsThisWeek}
            </span>{' '}
            chuyến xe
          </p>
        </div>
      </div>
    </div>
  );
};

export default Schedules;