import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { DriverLayout } from "../layouts/DriverLayout";
import { ParentLayout } from "../layouts/ParentLayout";
import { RootLayout } from "../layouts/RootLayout";
import { NotFoundPage } from "../pages/404Page";
import { Bus } from "../pages/admin/Bus/getAllBus";
import { Buss } from "../pages/admin/MapBuss";
import { Overview } from "../pages/admin/Overview";
import { RouteAdmin } from "../pages/admin/Route/RouteAdmin";
import { Schedules } from "../pages/admin/Schedules";
import { Student } from "../pages/admin/Student";
import { MapDriver } from "../pages/driver/Map";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { BusLocationPage } from "../pages/parent/busLocationPage";
import { NotiPage } from "../pages/parent/notiPage";
import { StudentPage } from "../pages/parent/studentPage";
import { StopsPointsPage } from "../pages/stopPoint";
// import { AddSchedulePage } from "../pages/admin/test_ui1"
// import DriverNotifications from "../pages/driver/Notifications"

import { GetAllStudent } from "../pages/admin/Students/getAllStudent";
import NotificationsPage from "../pages/driver/NotificationsPage";
import { DriverHome } from "../pages/driver/Home";
import { DriverSchedule } from "../pages/driver/Schedule";
import { Roles } from "../pages/admin/Roles";

export const path = {
    INDEX: "/",
    LOGIN: "/login",
    ADMIN: "/admin",

    ADMIN_OVERVIEW: "/admin",
    ADMIN_BUSES: "/admin/buses",
    ADMIN_BUS_MANAGEMENT: "/admin/bus-management",
    ADMIN_STOPS_POINTS: "/admin/stops_points",
    ADMIN_STUDENTS: "/admin/students",
    ADMIN_STUDENTS_MANAGEMENT: "/admin/students-management",
    ADMIN_SCHEDULES: "/admin/schedules",
    ADMIN_ROUTES: "/admin/routes",
    ADMIN_ACCESS_MANAGEMENT: "/admin/access-management",

    PARENT: "/parent",
    PARENT_NOTIFICATIONS: "/parent/notifications",
    PARENT_CHILD_INFO: "/parent/child-info",
    PARENT_STOP_POINT: "/parent/stop-point",
    PARENT_CHOOSE_ROUTE: "/parent/choose-route",
    PARENT_ASSIGN_ROUTE: "/parent/assign-route",

    DRIVER: "/driver",
    DRIVER_SCHEDULE: "/driver/schedule",
    DRIVER_QR_ROLL_CALL: "/driver/qr-roll-call",
    DRIVER_NOTIFICATIONS: "/driver/notifications",
    DRIVER_TRIP: "/driver/trip/:id",
};


const ParentRoutes = [{
    path: path.PARENT,
    element: <ParentLayout />,
    children: [
        {
            index: true,
            element: <BusLocationPage />,
        },
        {
            path: path.PARENT_NOTIFICATIONS,
            element: <NotiPage />,
        },
        {
            path: path.PARENT_CHILD_INFO,
            element: <StudentPage />,
        },
    ],
},]

const AdminRoutes = [

    {
        path: path.ADMIN,
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <Overview />,
            },
            {
                path: path.ADMIN_BUSES,
                element: <Buss />,
            },
            {
                path: path.ADMIN_BUS_MANAGEMENT,
                element: <Bus />,
            },
            {
                path: path.ADMIN_STUDENTS_MANAGEMENT,
                element: <GetAllStudent />,
            }, {
                path: path.ADMIN_STOPS_POINTS,
                element: <StopsPointsPage />,
            },
            {
                path: path.ADMIN_STUDENTS,
                element: <Student />,
            },
            {
                path: path.ADMIN_SCHEDULES,
                element: <Schedules />,
            },
            {
                path: path.ADMIN_ROUTES,
                element: <RouteAdmin />,
            },
            {
                path: path.ADMIN_ACCESS_MANAGEMENT,
                element: <Roles />,
            }
        ],
    },
]

const DriverRoutes = [
    {
        path: path.DRIVER,
        element: <DriverLayout />,
        children: [
            {
                index: true,
                element: <DriverHome />
            },
            {
                path: path.DRIVER_SCHEDULE,
                element: <DriverSchedule />
            },
            {
                path: path.DRIVER_NOTIFICATIONS,
                element: <NotificationsPage />,
            },
        ],
    },
    {
        path: path.DRIVER_TRIP,
        element: <MapDriver />,
    },
]

export const router = createBrowserRouter([
    // provider api for all routes
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: path.LOGIN,
                element: <LoginPage />,
            },
            ...AdminRoutes,
            ...ParentRoutes,
            ...DriverRoutes,
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
]);
