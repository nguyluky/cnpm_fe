
import 'mapbox-gl/dist/mapbox-gl.css';
import React from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Outlet } from 'react-router';
import { Sidebar } from "../components/uiPart/Sidebar";

export function AdminLayout() {
    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar role="admin" />
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div >
        </div>
    );
}
