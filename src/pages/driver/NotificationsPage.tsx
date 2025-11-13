import React from 'react';
import { Card } from '../../components/uiItem/card';
import { BarcodeScanFrame } from '../../components/uiPart/BarCodeScan'; // Đường dẫn tùy thuộc vào project của bạn


interface Notification {
    id: number;
    title: string;
    content: string;
    date: string;
}

const notifications: Notification[] = [
    { id: 1, title: 'Thông báo nghỉ học', content: 'Ngày mai học sinh lớp 6A nghỉ học do sự cố đường', date: '11/11/2025' },
    { id: 2, title: 'Thông báo đổi lịch xe', content: 'Ca chiều sẽ khởi hành sớm hơn 15 phút', date: '11/11/2025' },
    { id: 3, title: 'Thông báo mới từ nhà trường', content: 'Học sinh cần mang thêm đồ dùng học tập', date: '10/11/2025' },
];

export const NotificationsPage: React.FC = () => {
    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <Card className="p-6 text-center bg-purple-600 text-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-auto mb-2"
                    >
                        <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                        <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
                    </svg>            
                    <h2 className="text-2xl font-semibold mb-2">Thông báo</h2>
                </Card>

                {/* Component barcode quét thẻ sinh viên */}
                <BarcodeScanFrame />

                <div className="space-y-4">
                    {notifications.map((notif) => (
                        <Card key={notif.id} className="p-4 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">{notif.title}</h3>
                                    <p className="text-slate-600 mt-1">{notif.content}</p>
                                </div>
                                <span className="text-sm text-slate-400">{notif.date}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
