import React from 'react';
// import { MapPin } from 'lucide-react';
import { Card } from '../uiItem/card';
// import { Button } from '../uiItem/button';
import { Avatar, AvatarFallback } from '../uiItem/avatar';
// import { Badge } from '../../../components/ui/badge';

export interface Driver {
  name: string;
  role: string;
  avatar?: string;
}

export interface ScheduleCardProps {
  shiftType: 'morning' | 'afternoon';
  shiftLabel: string;
  timeRange: string;
  route: string;
  school: string;
  drivers: Driver[];
  onStart?: () => void;
  onAbsent?: () => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  shiftType,
  shiftLabel,
  timeRange,
  route,
  school,
  drivers,
  // onStart,d
  // onAbsent
}) => {
  const bgColor = shiftType === 'morning' ? 'bg-amber-50' : 'bg-blue-50';
  const borderColor = shiftType === 'morning' ? 'border-amber-200' : 'border-blue-200';

  return (
    <Card className={`${bgColor} ${borderColor} border-l-4 overflow-hidden`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 text-lg">{shiftLabel}</h3>
            <p className="text-sm text-slate-600 mt-1">{route}</p>
          </div>
          <span className="text-sm text-slate-500">{timeRange}</span>
        </div>

        {/* School Info */}
        <div className="flex items-center gap-2 mb-4 text-sm text-slate-700">
          {/* MapPin SVG */}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 10.5c0 7.5-9 12-9 12s-9-4.5-9-12a9 9 0 1 1 18 0z"
            />
            <circle
              cx="12"
              cy="10.5"
              r="3"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{school}</span>
        </div>

        {/* Drivers */}
        <div className="space-y-3">
          {drivers.map((driver, index) => (
            <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 bg-primary text-white font-bold">
                  <AvatarFallback className="bg-primary text-white">
                    {driver.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-900">{driver.name}</p>
                  <p className="text-xs text-slate-500">{driver.role}</p>
                </div>
              </div>

              {/* <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={onStart}
                >
                  Bắt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-300"
                  onClick={onAbsent}
                >
                  Vắng
                </Button>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};