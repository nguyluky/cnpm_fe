import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../uiItem/avatar"; // Sửa đường dẫn nếu alias `@` chưa được cấu hình
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bus,
  Users,
  Route,
  Calendar,
  MessageSquare,
  MapPin,
  Bell,
  User,
  ClipboardList,
} from "lucide-react";
import { Button } from "../uiItem/button"; // Sửa đường dẫn nếu alias `@` chưa được cấu hình
import { LogOutConfirmation } from "./LogOutConfirmation";
import { path } from "../../router";

interface SidebarProps {
  role?: "admin" | "parent" | "driver";
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role = "driver",
  className = "",
}) => {
  // const location = useLocation();

  // 🧭 Các menu cho từng vai trò
  const [isLogoutWindowOpen, setLogoutWindowOpen] = useState(false);
  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Tổng quan", path: path.ADMIN_OVERVIEW }, // Đã thay đổi
    { icon: Bus, label: "Quản lý xe buýt", path: path.ADMIN_BUSES },
    { icon: Users, label: "Học sinh", path: path.ADMIN_STUDENTS },
    { icon: Route, label: "Tuyến đường", path: path.ADMIN_ROUTES },
    { icon: ClipboardList, label: "Điểm dừng", path: path.ADMIN_STOPS_POINTS }, // Đã thay đổi
    { icon: Calendar, label: "Lịch trình", path: path.ADMIN_SCHEDULES }, // Đã thay đổi
    { icon: MessageSquare, label: "Tin nhắn", path: "/admin/messages" }, // Giữ nguyên, không có trong path mới
  ];

  const parentMenuItems = [
    { icon: MapPin, label: "Theo dõi xe buýt", path: path.PARENT }, // Đã thay đổi
    { icon: Bell, label: "Thông báo", path: path.PARENT_NOTIFICATIONS }, // Đã thay đổi
    { icon: User, label: "Thông tin con em", path: path.PARENT_CHILD_INFO }, // Đã thay đổi
  ];

  const driverMenuItems = [
    { icon: ClipboardList, label: "Tổng quan hôm nay", path: path.DRIVER }, // Đã thay đổi
    { icon: Users, label: "Lịch làm việc", path: path.DRIVER_SCHEDULE }, // Đã thay đổi
    { icon: Bell, label: "Thông báo", path: "/driver/notifications" }, // Giữ nguyên, không có trong path mới
  ];

  const menuItems =
    role === "admin"
      ? adminMenuItems
      : role === "parent"
        ? parentMenuItems
        : driverMenuItems;

  // 🖌️ Màu tiêu đề phụ thuộc role
  const roleLabel =
    role === "admin" ? "Quản lý" : role === "parent" ? "Phụ huynh" : "Tài xế";

  const pathPrefix =
    role === "admin" ? "/admin" : role === "parent" ? "/parent" : "/driver";

  return (
    <aside
      className={`md:w-64 w-25 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800 ${className}`}
    >
      {/* Logo Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="hidden md:block text-lg font-bold">SSB 1.0</h1>
            <p className="hidden md:block text-xs text-slate-400">
              {roleLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === pathPrefix}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "bg-slate-800 text-white shadow"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:block text-sm font-medium">
                    {item.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-5 flex flex-row gap-5 text-white transition hover:bg-slate-800">
        <div className="aspect-square">
          <Avatar className="w-10 h-10 border-2 border-primary">
            <AvatarFallback className="bg-primary text-white font-bold">
              Q
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="my-auto truncate">Quốc Đại ngáy ngủ</div>
        <button onClick={() => setLogoutWindowOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="my-auto lucide lucide-log-out-icon lucide-log-out"

          >
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          </svg>
        </button>
      </div>

      <LogOutConfirmation isOpen={isLogoutWindowOpen} onClose={() => setLogoutWindowOpen(false)} />
    </aside>
  );
};

export default Sidebar;
