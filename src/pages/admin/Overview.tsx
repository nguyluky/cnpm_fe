import React from "react";
import { Button } from "../../components/uiItem/button";
import { Bus, AlertTriangle, User, MapPin, Route } from "lucide-react";
import adminIcon from "../../assets/vector_admin.png";

export const Overview : React.FC = () => {
  const busRoutes = [
    { id: "29A-12345", status: "Hoạt động", student: "18/35 học sinh", route: "Tuyến 1 - Quận 1" },
    { id: "29B-11111", status: "Đang di chuyển", student: "22/45 học sinh", route: "Tuyến 2 - Quận 3" },
    { id: "29C-12222", status: "Bão trì", student: "0/35 học sinh", route: "Tuyến 3 - Quận 5" },
  ];

  const alerts = [
    { id: "BUS001", message: "Xe BUS001 bị trễ 5 phút tại điểm dừng", time: "20:38" },
    { id: "BUS001", message: "Xe BUS001 bị trễ 5 phút tại điểm dừng", time: "20:53" },
    { id: "BUS002", message: "Xe BUS002 báo sự cố, đang xử lý", time: "20:48" },
  ];

  const stats = [
    { label: "Tổng số xe Bus", value: 3, sub: "2 xe đang hoạt động" },
    { label: "Học sinh", value: 3, sub: "3 học sinh đang trễ xe" },
    { label: "Tuyến đường", value: 2, sub: "Tất cả học sinh đến trường" },
    { label: "Cảnh báo", value: 2, sub: "Cần xử lý ngay" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between gap-2"
          >
            {/* Text bên trái */}
            <div>
              <div className="text-sm text-gray-600">{stat.label}</div>
              <div className="text-lg font-semibold">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.sub}</div>
            </div>

            {/* Icon bên phải */}
            <div
              className={`p-2 rounded-full ${
                index === 3 ? "bg-red-100" : "bg-gray-100"
              }`}
            >
              {index === 0 ? (
                <Bus className="text-purple-600" />
              ) : index === 1 ? (
                <User className="text-green-600" />
              ) : index === 2 ? (
                <Route className="text-blue-600" />
              ) : (
                <AlertTriangle className="text-red-600" />
              )}
            </div>
          </div>
        ))}
      </div>


      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bus Routes Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bus className="text-purple-600" /> Trạng thái xe Bus trực tiếp
          </h2>
           <div className="space-y-4">
          {busRoutes.map((route) => (
            <div key={route.id} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-center justify-between">
              <div>
                <div className="font-medium">{route.id}</div>
                <div className="text-sm text-gray-500">{route.route}</div>
              </div>
              <div className="text-text-right flex items-center justify-end gap-2">
                <span
                  className="px-2 py-1 rounded-full text-xs"
                  style={{
                    color: route.status === "Hoạt động" ? "#FFFDFD" :
                          route.status === "Đang di chuyển" ? "#374151" :
                          "#FFFDFD",
                    backgroundColor: route.status === "Hoạt động" ? "#1B763E" :
                                    route.status === "Đang di chuyển" ? "#C5B8B8" :
                                    "#EB6565"
                  }}
                >
                  {route.status}
                </span>
                <div className="text-xs text-gray-500">{route.student}</div>
              </div>
            </div>
          ))}
        </div>
        </div>
        

        {/* Alerts Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-600" /> Thông báo gần đây
          </h2>
           <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id + alert.time}
                className="bg-yellow-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-medium">{alert.message}</div>
                <div className="text-xs text-gray-500 mt-1">{alert.time}</div>
              </div>
            ))}
            </div>
        </div>
      </div>

{/* Navigation Buttons as Cards */}
<div className="bg-white w-240 h-20 rounded-xl shadow hover:shadow-lg transition flex justify-between items-center p-7 ">
  {/* Card 1 */}
  <div className="bg-white w-50 h-20 rounded-xl shadow duration-[500ms] hover:[background-color:#111827] transition flex flex-col items-center justify-center cursor-pointer ">
    <Bus className="text-purple-600 w-6 h-6 mb-2" />
    <span className="font-medium text-gray-800 text-sm">Thêm xe mới</span>
  </div>

  {/* Card 2 */}
  <div className="bg-white w-50 h-20 rounded-xl shadow duration-[500ms] hover:[background-color:#111827] transition flex flex-col items-center justify-center cursor-pointer">
    <Route className="text-blue-600 w-6 h-6 mb-2" />
    <span className="font-medium text-gray-800 text-sm">Tạo tuyến mới</span>
  </div>

  {/* Card 3 */}
  <div className="bg-white w-50 h-20 rounded-xl  shadow duration-[500ms] hover:[background-color:#111827] transition flex flex-col items-center justify-center cursor-pointer">
    <User className="text-green-600 w-6 h-6 mb-2" />
    <span className="font-medium text-gray-800 text-sm">Thêm học sinh</span>
  </div>

  {/* Card 4 */}
  <div className="bg-white w-50 h-20 rounded-xl  shadow duration-[500ms] hover:[background-color:#111827] transition flex flex-col items-center justify-center cursor-pointer">
    <MapPin className="text-red-600 w-6 h-6 mb-2" />
    <span className="font-medium text-gray-800 text-sm ">Xem bản đồ</span>
  </div>
</div>


    </div>
  );
};
