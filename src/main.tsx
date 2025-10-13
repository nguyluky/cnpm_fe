import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AdminLayout } from './layouts/AdminLayout'
import './index.css'
import { StopsPointsPage } from './pages/stopPoint'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="stops_points" element={<StopsPointsPage />} />
                </Route>
                <Route index element={
                    <div>Hello, World!</div>
                } />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
