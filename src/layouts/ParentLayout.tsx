import 'mapbox-gl/dist/mapbox-gl.css';
import { Outlet } from 'react-router';
import { Sidebar } from "../components/uiPart/Sidebar";
// import { Header } from "../components/uiPart/Header";
import { useLocation } from "react-router-dom";

export function ParentLayout() {
  const location = useLocation();
  const pathname: Record<string, string> = {
    '/parent': 'Theo doi xe Bus',
    '/parent/notifications': 'Thong bao',
    '/parent/child-info': 'Thong tin hoc sinh',
  }

  const title = pathname[location.pathname] || 'Dashboard';
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar role="parent" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
	{/*<Header
          title={title}
          subtitle="Thứ Năm Ngày 2 Tháng 10, 2025"
        />*/}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div >
    </div>
  );

  {/*
  const [collapsed, setCollapsed] = useState(false);
return (
    <div className="min-h-screen flex flex-row">
      {// Sider }
      <div className={!collapsed ? "bg-base-200 w-[250px] py-2 shadow-xl" : "bg-base-200 w-[60px] py-2 shadow-xl "}>
        <div className="h-[50px] p-4 flex items-center justify-between">
          {!collapsed && <span className="text-2xl">
            <p className="text-2xl font-bold ">
              Bus
            </p>
            <p className="text-2xl font-bold ">
              manager
            </p>
          </span>}

          <FontAwesomeIcon icon={faBars} onClick={() => {
            setCollapsed(!collapsed);
          }} />
        </div>

        {!collapsed && <ul className="menu mt-5 bg-base-200 rounded-box w-full">
          <li>
            <h2 className="menu-title">General</h2>
            <ul>
              <li><a href="/parent">
                <span>Dashboard</span>

              </a></li>
              <li><a href="/parent/bus-location"><span>Vi tri xe bus</span></a></li>
              <li><a href="/parent/noti"><span>Thong bao</span></a></li>
              <li><a href="/parent/student"><span>Thong tin hoc sinh</span></a></li>
            </ul>
          </li>
        </ul>}
      </div>

      <div className="w-[2px] bg-primary/20" />

      {// Main Content }
      <div className="flex-grow bg-gray-100">
        <Outlet />
      </div>

    </div>
  );
  */}
}
