import React, { useState } from "react";
import { Button } from "../../components/uiItem/button";
import { Plus } from "lucide-react";
import { Calendar } from "lucide-react";
import { Clock } from "lucide-react";
import Select from 'react-select';
import { vi } from 'date-fns/locale'; // Hiển thị tiếng Việt: Thứ 2, Tháng 1,...
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const Schedules = () => {
  // const [selectedDate, setSelectedDate] = useState("10/10/2025");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Mặc định hôm nay
  // Format ngày đẹp: "Thứ 6, 22/11/2025"
    const formatDateDisplay = (date: Date) => {
      return format(date, 'EEEE, dd/MM/yyyy', { locale: vi });
    };
  const busOptions = [
  { value: 'bus_001', label: '29A-12345 - Trần Văn A' },
  { value: 'bus_002', label: '29B-67890 - Nguyễn Thị B' },
  // ... hàng trăm xe khác
  ];

const routeOptions = [
  { value: 'route_01', label: 'Tuyến 01 - Bến Thành → Chợ Lớn' },
  { value: 'route_02', label: 'Tuyến 52 - Bến Xe Miền Tây → Đại học Quốc Gia' },
  // ...
  ];

const driverOptions = [
  { value: 'driver_001', label: 'Nguyễn Văn An (A12345)' },
  { value: 'driver_002', label: 'Trần Thị Bé (B67890)' },
  // ...
  ];
  
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
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="default"
          className="bg-indigo-600 text-white flex items-center h-10 px-4 rounded-lg hover:bg-indigo-700"
        >
          <Plus className="mr-2" size={18} /> Tạo lịch mới
        </Button>
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
        </div>


{/* Schedule Section */}
    <div className="bg-white rounded-lg shadow px-8 py-6 border border-blue-200">
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-700 text-base font-semibold">
          Lịch trình ngày
        </span>

        <div className="relative">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date as Date)}
            dateFormat="dd/MM/yyyy"
            locale={vi}
            customInput={
              <div className="relative cursor-pointer">
                <input
                  type="text"
                  readOnly
                  value={formatDateDisplay(selectedDate)}
                  className="h-12 w-64 px-4 pr-12 border border-gray-300 rounded-lg 
                           bg-white text-gray-800 font-medium text-sm
                           hover:border-indigo-400 focus:border-indigo-500 
                           focus:ring-2 focus:ring-indigo-100 outline-none
                           cursor-pointer transition-all"
                  placeholder="Chọn ngày"
                />
                <Calendar 
                  size={20} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" 
                />
              </div>
            }
            popperClassName="z-50"
            wrapperClassName="w-full"
          />
        </div>
      </div>

      {/* Phần hiển thị danh sách lịch trình theo ngày sẽ ở đây
      <div className="text-sm text-gray-600">
        Đang hiển thị lịch trình của: <span className="font-semibold text-indigo-600">
          {formatDateDisplay(selectedDate)}
        </span>
      </div> */}

    

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