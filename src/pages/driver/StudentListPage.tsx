import React from 'react';
import { Card } from '../../components/uiItem/card';
// import { Users } from 'lucide-react';

export const StudentListPage: React.FC = () => {
    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <Card className="p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></svg>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">Danh sách học sinh</h2>
                    <p className="text-slate-500">Trang này đang được phát triển</p>
                </Card>
            </div>
        </div>
    );
};
