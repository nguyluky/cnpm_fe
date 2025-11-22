import { createBrowserRouter } from "react-router-dom"
import { AdminLayout } from "../layouts/AdminLayout"
import { ParentLayout } from "../layouts/ParentLayout"
import { NotFoundPage } from "../pages/404Page"
import { Buss } from "../pages/admin/Buss"
import { Overview } from "../pages/admin/Overview"
import { RouteAdmin } from "../pages/admin/RouteAdmin"
import { Schedules } from "../pages/admin/Schedules"
import { Student } from "../pages/admin/Student"
import { Parent } from "../pages/admin/Parent"
import { HomePage } from "../pages/HomePage"
import { LoginPage } from "../pages/LoginPage"
import { BusLocationPage } from "../pages/parent/busLocationPage"
import { NotiPage } from "../pages/parent/notiPage"
import { StudentPage } from "../pages/parent/studentPage"
import { StopsPointsPage } from "../pages/stopPoint"
// import { AddSchedulePage } from "../pages/admin/test_ui1"
import { DriverLayout } from "../layouts/DriverLayout"
import { RootLayout } from "../layouts/RootLayout"
import ScheduleAdminTable from "../pages/admin/test_ui"
import { DriverHome } from "../pages/driver/Home"
// import DriverNotifications from "../pages/driver/Notifications"
import QRRollCall from "../pages/driver/QRRollCall"
import DriverSchedule from "../pages/driver/Schedule"
import { MapDriver } from "../pages/driver/Map"

import NotificationsPage from "../pages/driver/NotificationsPage"
import { Home } from "lucide-react"

export const path = {
    INDEX: "/",
    LOGIN: "/login",
    ADMIN: "/admin",

    ADMIN_OVERVIEW: "/admin",
    ADMIN_BUSES: "/admin/buses",
    ADMIN_STOPS_POINTS: "/admin/stops_points",
    ADMIN_STUDENTS: "/admin/students",
    ADMIN_PARENTS: "/admin/parents",
    ADMIN_SCHEDULES: "/admin/schedules",
    ADMIN_ROUTES: "/admin/routes",

    PARENT: "/parent",
    PARENT_NOTIFICATIONS: "/parent/notifications",
    PARENT_CHILD_INFO: "/parent/child-info",

    DRIVER: "/driver",
    DRIVER_SCHEDULE: "/driver/schedule",
    DRIVER_QR_ROLL_CALL: "/driver/qr-roll-call",
    DRIVER_NOTIFICATIONS: "/driver/notifications",
    DRIVER_TRIP: "/driver/trip/:id",
}


export const router = createBrowserRouter([
    // provider api for all routes
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: path.LOGIN,
                element: <LoginPage />
            },
            {
                path: path.PARENT,
                element: <ParentLayout />,
                children: [
                    {
                        index: true,
                        element: <BusLocationPage />
                    },
                    {
                        path: path.PARENT_NOTIFICATIONS,
                        element: <NotiPage />
                    },
                    {
                        path: path.PARENT_CHILD_INFO,
                        element: <StudentPage />
                    }
                ]
            },
            {
                path: path.ADMIN,
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <Overview />
                    },
                    {
                        path: path.ADMIN_BUSES,
                        element: <Buss />
                    },
                    {
                        path: path.ADMIN_STOPS_POINTS,
                        element: <StopsPointsPage />
                    },
                    {
                        path: path.ADMIN_STUDENTS,
                        element: <Student />
                    },
                    {
                        path: path.ADMIN_PARENTS,
                        element: <Parent />
                    },
                    {
                        path: path.ADMIN_SCHEDULES,
                        element: <Schedules />
                    },
                    {
                        path: path.ADMIN_ROUTES,
                        element: <RouteAdmin />
                    }
                ]
            },
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
                        path: path.DRIVER_QR_ROLL_CALL,
                        element: <QRRollCall />
                    },
                    

                ]
            },
            {
                path: path.DRIVER_TRIP,
                element: <MapDriver />
            },
            {
                path: "/test",
                element: <ScheduleAdminTable />
            },
            {
                path: "*",
                element: <NotFoundPage />
            },
            {
                path: path.DRIVER_NOTIFICATIONS,
                element: <NotificationsPage />
            }
        ]
    }

])
