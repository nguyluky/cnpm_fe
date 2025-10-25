import React from 'react';
import { Card } from '../../components/uiItem/card';
// import { Bell } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <Card className="p-8 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                        <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
                    </svg>          
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">Thống báo</h2>
                    <p className="text-slate-500">Trang này đang được phát triển</p>
                </Card>
            </div>
        </div>
    );
};