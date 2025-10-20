import React from 'react';
import { Button } from '../uiItem/button'; // Sửa đường dẫn nếu alias `@` chưa được cấu hình
import { Avatar, AvatarFallback, AvatarImage } from '../uiItem/avatar'; // Sửa đường dẫn nếu alias `@` chưa được cấu hình

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    return (
        <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                    {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="gap-2">
                        <span className="text-emerald-600 font-medium">Phụ huynh</span>
                    </Button>

                    <Button variant="ghost" size="icon">
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
                    </Button>

                    <Avatar className="w-10 h-10 border-2 border-primary">
                        <AvatarImage src="/path/to/image.jpg" alt="User Avatar" />
                        <AvatarFallback className="bg-primary text-white font-bold">
                            A
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
};
