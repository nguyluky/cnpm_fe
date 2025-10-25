import React from "react";
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

interface SidebarProps {
  role?: "admin" | "parent" | "driver";
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ role = "driver", className = "" }) => {
  // const location = useLocation();

  // 🧭 Các menu cho từng vai trò
  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Tổng quan", path: "/admin" },
    { icon: Bus, label: "Quản lý xe buýt", path: "/admin/buses" },
    { icon: Users, label: "Học sinh", path: "/admin/students" },
    { icon: Route, label: "Tuyến đường", path: "/admin/routes" },
    { icon: Calendar, label: "Lịch trình", path: "/admin/schedules" },
    { icon: MessageSquare, label: "Tin nhắn", path: "/admin/messages" },
  ];

  const parentMenuItems = [
    { icon: MapPin, label: "Theo dõi xe buýt", path: "/parent" },
    { icon: Bell, label: "Thông báo", path: "/parent/notifications" },
    { icon: User, label: "Thông tin con em", path: "/parent/child-info" },
  ];

  const driverMenuItems = [
    { icon: ClipboardList, label: "Tổng quan hôm nay", path: "/driver" },
    { icon: Users, label: "Lịch làm việc", path: "/driver/schedule" },
    { icon: Bell, label: "Thông báo", path: "/driver/notifications" },
  ];

  const menuItems =
    role === "admin" ? adminMenuItems : role === "parent" ? parentMenuItems : driverMenuItems;

  // 🖌️ Màu tiêu đề phụ thuộc role
  const roleLabel =
    role === "admin" ? "Quản lý" : role === "parent" ? "Phụ huynh" : "Tài xế";

  const pathPrefix = role === "admin" ? "/admin" : role === "parent" ? "/parent" : "/driver";

  return (
    <aside
      className={`w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800 ${className}`}
    >
      {/* Logo Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">SSB 1.0</h1>
            <p className="text-xs text-slate-400">{roleLabel}</p>
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
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                      ? "bg-slate-800 text-white shadow"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
