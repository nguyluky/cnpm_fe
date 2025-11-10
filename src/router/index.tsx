import { createBrowserRouter } from "react-router-dom"
import { HomePage } from "../pages/HomePage"
import { LoginPage } from "../pages/LoginPage"
import { ParentLayout } from "../layouts/ParentLayout"
import { BusLocationPage } from "../pages/parent/busLocationPage"
import { NotiPage } from "../pages/parent/notiPage"
import { AdminLayout } from "../layouts/AdminLayout"
import { Overview } from "../pages/admin/Overview"
import { Buss } from "../pages/admin/Buss"
import { StopsPointsPage } from "../pages/stopPoint"
import { StudentPage } from "../pages/parent/studentPage"
import { Schedules } from "../pages/admin/Schedules"
import { RouteAdmin } from "../pages/admin/RouteAdmin"
import { WorkOverviewPage } from "../pages/driver/WorkOverviewPage"
import { RootLayout } from "../layouts/RootLayout"
import { WorkSchedulePage } from "../pages/driver/WorkSchedulePage"
import { NotFoundPage } from "../pages/404Page"

export const path = {
  INDEX: "/",
  LOGIN: "/login",
  ADMIN: "/admin",

  ADMIN_OVERVIEW: "/admin",
  ADMIN_BUSES: "/admin/buses",
  ADMIN_STOPS_POINTS: "/admin/stops_points",
  ADMIN_STUDENTS: "/admin/students",
  ADMIN_SCHEDULES: "/admin/schedules",
  ADMIN_ROUTES: "/admin/routes",

  PARENT: "/parent",
  PARENT_NOTIFICATIONS: "/parent/notifications",
  PARENT_CHILD_INFO: "/parent/child-info",

  DRIVER: "/driver",
  DRIVER_SCHEDULE: "/driver/schedule",
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
            element: <StudentPage />
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
        element: <div>Driver Layout Placeholder</div>,
        children: [
          {
            index: true,
            element: <WorkSchedulePage />
          },
          {
            path: path.DRIVER_SCHEDULE,
            element: <WorkOverviewPage />
          }
        ]
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ]
  }

])
