import React from 'react';
import { Card } from '../uiItem/card';
import { Badge } from '../uiItem/badge';
import { Button } from '../uiItem/button';

export interface QuickInfoProps {
  electricCount: number;
  studyCount: number;
  routeInfo: {
    vehicle: string;
    route: string;
    vehicleId: string;
    time: string;
  };
}

export const QuickInfoSidebar: React.FC<QuickInfoProps> = ({
  electricCount,
  studyCount,
  routeInfo
}) => {
  return (
    <div className="space-y-4">
      {/* Quick Info */}
      <Card className="p-4">
        <h3 className="font-semibold text-slate-900 mb-4">Thông tin nhanh</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-sm text-slate-700">Điểm đón</span>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {electricCount}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-slate-700">Học sinh</span>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              {studyCount}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Warning Note */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-2 mb-3">
          {/* AlertTriangle SVG */}
          <svg
            className="w-5 h-5 text-amber-600 mt-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.29 3.86a2 2 0 013.42 0l7.13 12.26A2 2 0 0119.13 19H4.87a2 2 0 01-1.71-2.88l7.13-12.26z"
            />
            <line
              x1="12"
              y1="9"
              x2="12"
              y2="13"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <line
              x1="12"
              y1="17"
              x2="12.01"
              y2="17"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
          <h3 className="font-semibold text-slate-900">Ghi chú dành báo</h3>
        </div>
        
        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
          {/* FileText SVG */}
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            />
            <polyline
              points="14 2 14 8 20 8"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="16"
              y1="13"
              x2="8"
              y2="13"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <line
              x1="16"
              y1="17"
              x2="8"
              y2="17"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <line
              x1="10"
              y1="9"
              x2="9"
              y2="9"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
          Báo cáo sự cố
        </Button>
      </Card>

      {/* Route Info */}
      <Card className="p-4">
        <h3 className="font-semibold text-slate-900 mb-4">Thông tin tuyến</h3>
        
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-slate-500 mb-1">Tuyến đường</p>
            <p className="text-slate-900 font-medium">{routeInfo.route}</p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Xe buýt</p>
            <p className="text-slate-900 font-medium">{routeInfo.vehicleId}</p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Giờ làm việc</p>
            <p className="text-slate-900 font-medium">{routeInfo.time}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};