import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AdminLayout } from './layouts/AdminLayout'
import { LoginPage } from './pages/LoginPage';
import './index.css'
import { HomePage } from './HomePage'
import { ParentLayout } from "./layouts/ParentLayout";
import { BusLocationPage } from "./pages/busLocation";
import { NotiPage } from "./pages/noti";
import { StudentPage } from "./pages/student";
import { DriverLayout, StopsPointsPage, WorkSchedulePage } from './pages/stopPoint'
import { WorkOverviewPage } from './pages/driver/WorkOverviewPage';

import { Overview } from './pages/admin/overview';
import { Bus } from './pages/admin/Bus';
import { Student } from './pages/admin/Student';
// import { WelcomeBanner } from './components/uiPart/WelcomeBanner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="stops_points" element={<StopsPointsPage />} />
        </Route>
        <Route path="/parent" element={<ParentLayout />}>
          <Route index element={<BusLocationPage />} />
          <Route path="notifications" element={<NotiPage />} />
          <Route path="child-info" element={<StudentPage />} />
        </Route>
        <Route path="/driver" element={<DriverLayout />}>
          <Route index element={<WorkSchedulePage />} />
          <Route path="schedule" element={<WorkOverviewPage />} />
        </Route>
          <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Overview />} />
          <Route path="buses" element={<Bus />} />
            <Route path="students" element={<Student />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
