import React, { useState, useMemo, useEffect } from "react";
import { Button } from "../../components/uiItem/button";
import { Plus, Calendar, Clock, Edit, Trash2, Eye, MapPin, Users, AlertCircle } from "lucide-react";
import Select from 'react-select';
import { vi } from 'date-fns/locale';
import { format, startOfWeek, addDays, getDay, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// === DỮ LIỆU MẪU ===
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

const studentsOnTrip = [
  { id: "stu_001", name: "Nguyễn Thị Mai", pickedUp: true,absent: true },
  { id: "stu_002", name: "Trần Văn Hùng", pickedUp: false, absent: false },
  { id: "stu_003", name: "Lê Thị Lan", pickedUp: true ,absent: false},
  { id: "stu_004", name: "Phạm Minh Tuấn", pickedUp: false ,absent: true},
];

// Lịch trình từ DB (giờ có thêm trường createdAt để dễ quản lý)
let schedulesDB = [
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
    createdAt: "2025-11-01",
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
    createdAt: "2025-11-02",
  },
  {
    id: "sch_003",
    routeId: "route_01",
    busId: "bus_001",
    driverId: "driver_001",
    type: "AFTERNOON" as const,
    daysOfWeek: [1, 2, 3, 4, 5],
    startTime: "16:45:00",
    startDate: "2025-11-01",
    endDate: null,
    status: "ACTIVE" as const,
    createdAt: "2025-11-03",
  },
];

// === HELPER ===
const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

const isScheduleActiveOnDate = (sch: any, date: Date): boolean => {
  if (sch.status !== "ACTIVE") return false;
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayOfWeek = getDay(date) || 7;
  return (
    sch.daysOfWeek.includes(dayOfWeek) &&
    dateStr >= sch.startDate &&
    (!sch.endDate || dateStr <= sch.endDate)
  );
};

const checkConflict = (newSch: any, editId?: string) => {
  const newStart = parse(newSch.startTime + ":00", 'HH:mm:ss', new Date());
  const newEnd = newSch.type === "MORNING" ? parse("08:30:00", 'HH:mm:ss', new Date()) : parse("18:30:00", 'HH:mm:ss', new Date());

  for (const sch of schedulesDB) {
    if (editId && sch.id === editId) continue;
    const checkDate = new Date(newSch.startDate);
    if (!isScheduleActiveOnDate(sch, checkDate)) continue;
    if (!sch.daysOfWeek.includes(getDay(checkDate) || 7)) continue;

    const schStart = parse(sch.startTime, 'HH:mm:ss', new Date());
    const schEnd = sch.type === "MORNING" ? parse("08:30:00", 'HH:mm:ss', new Date()) : parse("18:30:00", 'HH:mm:ss', new Date());

    const overlap = newStart < schEnd && schStart < newEnd;
    if (overlap && (sch.busId === newSch.busId || sch.driverId === newSch.driverId)) {
      const item = sch.busId === newSch.busId ? "Xe" : "Tài xế";
      const name = sch.busId === newSch.busId
        ? busOptions.find(b => b.value === sch.busId)?.label.split(" - ")[0]
        : driverOptions.find(d => d.value === sch.driverId)?.label;
      return { conflict: true, message: `${item} "${name}" đã có lịch cùng thời gian!` };
    }
  }
  return { conflict: false, message: "" };
};

const formatDateDisplay = (date: Date) => format(date, 'EEEE, dd/MM/yyyy', { locale: vi });

export const Schedules = () => {
  const [schedules, setSchedules] = useState(schedulesDB);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [conflictError, setConflictError] = useState("");

  const [formData, setFormData] = useState<any>({
    routeId: "", busId: "", driverId: "", type: "MORNING", startTime: "06:45",
    daysOfWeek: [1, 2, 3, 4, 5], startDate: format(new Date(), 'yyyy-MM-dd'), endDate: "", status: "ACTIVE"
  });

  // Tự động xóa lỗi khi người dùng sửa form
  useEffect(() => { setConflictError(""); }, [formData.busId, formData.driverId, formData.startTime, formData.type, formData.startDate]);

  const openCreate = () => {
    setFormData({ routeId: "", busId: "", driverId: "", type: "MORNING", startTime: "06:45", daysOfWeek: [1,2,3,4,5], startDate: format(new Date(),'yyyy-MM-dd'), endDate: "", status: "ACTIVE" });
    setConflictError("");
    setIsCreateModalOpen(true);
  };

  const openEdit = (sch: any) => {
    setSelectedSchedule(sch);
    setFormData({ ...sch, startTime: sch.startTime.slice(0,5), endDate: sch.endDate || "" });
    setConflictError("");
    setIsEditModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, id: isEditModalOpen ? selectedSchedule.id : `sch_${Date.now()}`, startTime: formData.startTime + ":00" };
    const conflict = checkConflict(payload, isEditModalOpen ? selectedSchedule.id : undefined);
    if (conflict.conflict) { setConflictError(conflict.message); return; }

    if (isEditModalOpen) {
      setSchedules(prev => prev.map(s => s.id === selectedSchedule.id ? payload : s));
      setIsEditModalOpen(false);
    } else {
      setSchedules(prev => [...prev, payload]);
      setIsCreateModalOpen(false);
    }
    setConflictError("");
  };

  const handleDelete = (id: string) => confirm("Xóa lịch trình này?") && setSchedules(prev => prev.filter(s => s.id !== id));

  const todaySchedules = useMemo(() => {
    const dayOfWeek = getDay(selectedDate) || 7;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return schedules
      .filter(s => s.status === "ACTIVE" && s.daysOfWeek.includes(dayOfWeek) && dateStr >= s.startDate && (!s.endDate || dateStr <= s.endDate))
      .map(s => ({
        ...s,
        licensePlate: busOptions.find(b => b.value === s.busId)?.label.split(" - ")[0] || "N/A",
        driverName: driverOptions.find(d => d.value === s.driverId)?.label.split(" (")[0] || "N/A",
        routeName: routeOptions.find(r => r.value === s.routeId)?.label || "N/A",
        startTimeDisplay: s.startTime.slice(0,5),
      }));
  }, [schedules, selectedDate]);

  const morningSchedules = todaySchedules.filter(s => s.type === "MORNING");
  const afternoonSchedules = todaySchedules.filter(s => s.type === "AFTERNOON");

  const weeklySummary = useMemo(() => getWeekDays(selectedDate).map(date => ({
    date,
    dayShort: format(date, 'dd/MM'),
    tripCount: schedules.filter(sch => isScheduleActiveOnDate(sch, date)).length,
  })), [schedules, selectedDate]);

  const totalTripsThisWeek = weeklySummary.reduce((sum, d) => sum + d.tripCount, 0);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Lịch trình xe Bus</h2>
          <span className="text-gray-600 text-sm">Quản lý và phân công lịch trình</span>
        </div>
        <Button onClick={openCreate} className="bg-indigo-600 text-white flex items-center h-10 px-4 rounded-lg hover:bg-indigo-700">
          <Plus className="mr-2" size={18} /> Tạo lịch mới
        </Button>
      </div>

      {/* CHỌN NGÀY - GIỮ NGUYÊN ĐẸP NHƯ CŨ */}
      <div className="bg-white rounded-lg shadow px-8 py-6 border border-blue-200 mb-6">
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
                  />
                  <Calendar size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              }
            />
          </div>
        </div>

        {/* Danh sách ca làm việc - thêm nút hành động */}
        {[
          { type: "MORNING", data: morningSchedules, label: "Ca sáng (06:45 - 08:00)", color: "#dc2626" },
          { type: "AFTERNOON", data: afternoonSchedules, label: "Ca chiều (16:45 - 18:00)", color: "#2563eb" },
        ].map(shift => shift.data.length > 0 && (
          <div key={shift.type} className="mb-8">
            <div className="flex items-center mb-4 font-semibold text-gray-800">
              <Clock className="w-5 h-5 mr-2" style={{ color: shift.color }} />
              <span>{shift.label}</span>
              <span className="ml-3 text-sm text-gray-500">({shift.data.length} xe)</span>
            </div>

            {shift.data.map((bus: any) => (
              <div key={bus.id} className="flex items-center justify-between p-4 border rounded-lg mb-3 bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex items-center gap-4">
                  <div className="text-white font-bold px-4 py-2 rounded-lg shadow-sm flex items-center justify-center min-w-28" style={{ backgroundColor: "#6366f1" }}>
                    {bus.licensePlate.split("-")[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{bus.licensePlate}</div>
                    <div className="text-sm text-gray-600">{bus.routeName}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium text-gray-700">{bus.driverName}</div>
                  <div className="text-sm text-gray-500">{bus.startTimeDisplay} - {bus.type === "MORNING" ? "08:00" : "18:00"}</div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setSelectedSchedule(bus); setIsDetailModalOpen(true); }}><Eye size={16}/></Button>
                  <Button size="sm" variant="outline" onClick={() => openEdit(bus)}><Edit size={16}/></Button>
                  <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDelete(bus.id)}><Trash2 size={16}/></Button>
                </div>
              </div>
            ))}
          </div>
        ))}

        {todaySchedules.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Không có lịch trình nào trong ngày này</p>
          </div>
        )}
      </div>

      {/* Tổng quan tuần - giữ nguyên đẹp */}
      <div className="bg-white rounded-lg shadow p-6 border border-blue-200">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Tổng quan tuần ({weeklySummary[0].dayShort} - {weeklySummary[6].dayShort})
        </h3>
        <div className="grid grid-cols-7 gap-5 mb-8">
          {weeklySummary.map((day, idx) => (
            <div key={idx} className={`text-center p-6 rounded-2xl shadow-md transition-all hover:scale-105 ${day.tripCount > 0 ? 'bg-white border-2 border-indigo-300' : 'bg-gray-100 opacity-70'}`}>
              <p className="text-sm font-bold text-gray-600">{["Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7","Chủ nhật"][idx]}</p>
              <p className="text-4xl font-extrabold text-indigo-600 my-3">{day.tripCount}</p>
              <p className="text-xs text-gray-500">{day.dayShort}</p>
              <p className="text-sm text-gray-600 mt-1">chuyến</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Tổng cộng tuần này: <span className="text-4xl font-bold text-indigo-600">{totalTripsThisWeek}</span> chuyến xe
          </p>
        </div>
      </div>

{/* Modal Tạo / Sửa */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-screen overflow-y-auto p-8">
            <h3 className="text-2xl font-bold mb-8">{isEditModalOpen ? "Chỉnh sửa lịch trình" : "Tạo lịch trình mới"}</h3>
            {conflictError && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 flex items-center"><AlertCircle className="mr-2" /> {conflictError}</div>}
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
              {/* Cột trái */}
              <div className="space-y-6">
                <div>
                  <label className="block font-semibold mb-2">Xe buýt <span className="text-red-500">*</span></label>
                  <Select options={busOptions} onChange={(e) => setFormData({...formData, busId: e?.value})} value={busOptions.find(o => o.value === formData.busId)} required />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Tuyến đường <span className="text-red-500">*</span></label>
                  <Select options={routeOptions} onChange={(e) => setFormData({...formData, routeId: e?.value})} value={routeOptions.find(o => o.value === formData.routeId)} required />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Tài xế <span className="text-red-500">*</span></label>
                  <Select options={driverOptions} onChange={(e) => setFormData({...formData, driverId: e?.value})} value={driverOptions.find(o => o.value === formData.driverId)} required />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Ca làm việc</label>
                  <select className="w-full p-3 border rounded-lg" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="MORNING">Ca sáng</option>
                    <option value="AFTERNOON">Ca chiều</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Giờ bắt đầu</label>
                  <input type="time" className="w-full p-3 border rounded-lg" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required />
                </div>
              </div>

              {/* Cột phải */}
              <div className="space-y-6">
                <div>
                  <label className="block font-semibold mb-2">Các ngày trong tuần</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['T2','T3','T4','T5','T6','T7','CN'].map((d, i) => (
                      <label key={i} className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.daysOfWeek.includes(i+1)} onChange={(e) => {
                          const days = e.target.checked 
                            ? [...formData.daysOfWeek, i+1]
                            : formData.daysOfWeek.filter((d: number) => d !== i+1);
                          setFormData({...formData, daysOfWeek: days});
                        }} />
                        <span>{d}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Ngày bắt đầu</label>
                  <input type="date" className="w-full p-3 border rounded-lg" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Ngày kết thúc (tùy chọn)</label>
                  <input type="date" className="w-full p-3 border rounded-lg" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value || null})} />
                </div>
              </div>

              <div className="col-span-2 flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); setConflictError(""); }}>
                  Hủy
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                  {isEditModalOpen ? "Cập nhật" : "Tạo lịch trình"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
            {/* Modal Chi tiết chuyến */}
      {isDetailModalOpen && selectedSchedule && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto p-8">
            <h3 className="text-2xl font-bold mb-6">Chi tiết chuyến xe</h3>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-5 rounded-xl">
                <p className="text-sm text-gray-600">Biển số</p>
                <p className="text-xl font-bold">{busOptions.find(b => b.value === selectedSchedule.busId)?.label.split(" - ")[0]}</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl">
                <p className="text-sm text-gray-600">Tài xế</p>
                <p className="text-xl font-bold">{driverOptions.find(d => d.value === selectedSchedule.driverId)?.label}</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl">
                <p className="text-sm text-gray-600">Tuyến đường</p>
                <p className="text-xl font-bold">{routeOptions.find(r => r.value === selectedSchedule.routeId)?.label}</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl">
                <p className="text-sm text-gray-600">Thời gian</p>
                <p className="text-xl font-bold">{selectedSchedule.startTime.slice(0,5)} - {selectedSchedule.type === "MORNING" ? "08:00" : "18:00"}</p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-bold text-lg mb-4 flex items-center"><Users className="mr-2" /> Danh sách học sinh ({studentsOnTrip.length})</h4>
              <div className="space-y-3">
                {studentsOnTrip.map(stu => (
                  <div key={stu.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <span className="font-medium">{stu.name}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${stu.pickedUp ? 'bg-green-100 text-green-700' : stu.absent === true ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {stu.pickedUp ? "Đã lên xe" : stu.absent === true ? "Vắng" : "Chưa đón"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-5 rounded-xl flex items-center">
              <MapPin className="mr-3 text-blue-600" />
              <div>
                <p className="font-semibold">Vị trí hiện tại (GPS)</p>
                <p className="text-sm text-gray-600">Xe đang di chuyển trên đường Nguyễn Văn Cừ → Quận 1 (cập nhật 2 phút trước)</p>
              </div>
            </div>

            <div className="mt-8 text-right">
              <Button onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedules;
