import React, { useState } from 'react';
import { WelcomeBanner } from '../../components/uiPart/WelcomeBanner';
import { ScheduleCard } from '../../components/uiPart/ScheduleCard';
import { TripCard } from '../../components/uiPart/TripCard';
import { QuickInfoSidebar } from '../../components/uiPart/QuickInfoSidebar';
import { Card } from '../../components/uiItem/card';
import { toast } from 'sonner';

export const WorkSchedulePage: React.FC = () => {
  const [schedules] = useState([
    {
      id: 1,
      shiftType: 'morning' as const,
      shiftLabel: 'Ca sáng',
      timeRange: '06:45 - 08:00',
      route: 'Tuyến 1 - Quận 1',
      school: 'Trường THCS ABC',
      drivers: [
        { name: 'Nguyễn Minh Khang', role: 'Lái xe' }
      ]
    },
    {
      id: 2,
      shiftType: 'afternoon' as const,
      shiftLabel: 'Ca chiều',
      timeRange: '16:45 - 18:00',
      route: 'Tuyến 1 - Quận 1',
      school: 'Trường THCS ABC',
      drivers: [
        { name: 'Lê Thị Mai', role: 'Lái xe' }
      ]
    }
  ]);

  const [trips] = useState([
    {
      id: 1,
      schoolName: 'Đến với Bến Thành',
      time: '07:00',
      drivers: [
        { name: 'Nguyễn Minh Khang', role: 'Lái xe' },
        { name: 'Lê Thị Mai', role: 'Lái xe' }
      ]
    },
    {
      id: 2,
      schoolName: 'Công viên 23/9',
      time: '07:30',
      drivers: [
        { name: 'Nguyễn Minh Khang', role: 'Lái xe' },
        { name: 'Lê Thị Mai', role: 'Lái xe' }
      ]
    }
  ]);

  const handleStart = () => {
    toast.success('Đã bắt đầu chuyến đi');
  };

  const handleAbsent = () => {
    toast.info('Đã đánh dấu vắng mặt');
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Banner */}
            <WelcomeBanner
              driverName="Nguyễn Văn A"
              vehicleId="Xe buýt: 50A-1245"
              date="17/10/2023"
            />

            {/* Today's Schedule */}
            <Card className="p-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs">📅</span>
                </div>
                Lịch làm việc hôm nay
              </h2>

              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <ScheduleCard
                    key={schedule.id}
                    {...schedule}
                    onStart={handleStart}
                    onAbsent={handleAbsent}
                  />
                ))
                }
              </div>
            </Card>

            {/* Upcoming Trips */}
            <Card className="p-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xs">🚌</span>
                </div>
                Ca chiều
              </h2>

              <div className="space-y-4">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    {...trip}
                    onStart={handleStart}
                    onAbsent={handleAbsent}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <QuickInfoSidebar
              electricCount={2}
              studyCount={2}
              routeInfo={{
                vehicle: 'Xe buýt',
                route: 'Tuyến 1 - Quận 1',
                vehicleId: '50A-1245',
                time: '06:45 - 08:00'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};