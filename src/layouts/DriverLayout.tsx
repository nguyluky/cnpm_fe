import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/uiPart/Sidebar';
import { Header } from '../components/uiPart/Header';

interface DriverLayoutProps {
  children?: React.ReactNode;
}

export const DriverLayout: React.FC<DriverLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          title="Lịch làm việc" 
          subtitle="Thứ Năm Ngày 2 Tháng 10, 2025"
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};