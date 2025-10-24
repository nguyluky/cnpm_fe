import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AdminLayout } from './layouts/AdminLayout'
import { LoginPage } from './pages/LoginPage';
import './index.css'
import { StopsPointsPage } from './pages/stopPoint'
import { HomePage } from './HomePage'
import { ParentLayout } from "./layouts/ParentLayout";

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
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
