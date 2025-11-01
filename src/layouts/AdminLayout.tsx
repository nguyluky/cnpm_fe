
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import 'mapbox-gl/dist/mapbox-gl.css';
import React from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Outlet } from 'react-router';
import { Sidebar } from "../components/uiPart/Sidebar";
import { Header } from "../components/uiPart/Header";


export function AdminLayout() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
	{/*<Header
          title="Tổng quan"
          subtitle="Thứ Năm Ngày 2 Tháng 10, 2025"
        />*/}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div >
    </div>
  );
}

// export function AdminLayout() {
//     const [collapsed, setCollapsed] = useState(false);

//     return (
//         <div className="min-h-screen flex flex-row">
//             {/* Sider */}
//             <div className={"bg-base-200 w-[250px] py-2 shadow-xl "}>
//                 <h1 className="text-2xl font-bold h-[50px] p-4 flex items-center justify-between">
//                     <span className="text-2xl">
//                         <p>
//                             Bus
//                         </p>
//                         <p>
//                             manager
//                         </p>
//                     </span>

//                     <FontAwesomeIcon icon={faBars} onClick={() => {
//                         setCollapsed(!collapsed);
//                     }}/>
//                 </h1>

//                 <ul className="menu mt-5 bg-base-200 rounded-box w-full">
//                     <li>
//                         <h2 className="menu-title">General</h2>
//                         <ul>
//                             <li><a href="/admin">
//                                 <span>Dashboard</span>

//                             </a></li>
//                             <li><a href="/admin/buses"><span>Buses</span></a></li>
//                             <li><a href="/admin/drivers"><span>Drivers</span></a></li>
//                             <li><a href="/admin/stops_points"><span>Stops & Points</span></a></li>
//                             <li><a href="/admin/routes"><span>Routes</span></a></li>
//                         </ul>
//                     </li>
//                 </ul>
//             </div>

//             <div className="w-[2px] bg-primary/20" />

//             {/* Main Content */}
//             <div className="flex-grow bg-gray-100">
//                 <Outlet />
//             </div>

//         </div>
//     );
// }
