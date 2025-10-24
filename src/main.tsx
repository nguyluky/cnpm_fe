import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AdminLayout } from './layouts/AdminLayout'
import { LoginPage } from './pages/LoginPage';
import './index.css'
import { StopsPointsPage } from './pages/stopPoint'
import { HomePage } from './HomePage'
import { ParentLayout } from "./layouts/ParentLayout";
import { BusLocationPage } from "./pages/busLocation";
import { NotiPage } from "./pages/noti";
import { StudentPage } from "./pages/student";

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
          <Route path="bus-location" element={<BusLocationPage />} />
          <Route path="noti" element={<NotiPage />} />
          <Route path="student" element={<StudentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
