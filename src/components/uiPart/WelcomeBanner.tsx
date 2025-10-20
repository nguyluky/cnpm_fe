import React from 'react';
// import { Bus } from 'lucide-react';

interface WelcomeBannerProps {
    driverName: string;
    vehicleId: string;
    date: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
    driverName,
    vehicleId,
    date
}) => {
    return (
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
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
                            <path d="M8 6v6" />
                            <path d="M15 6v6" />
                            <path d="M2 12h19.6" />
                            <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
                            <circle cx="7" cy="18" r="2" />
                            <path d="M9 18h5" />
                            <circle cx="16" cy="18" r="2" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                            Xin chào, {driverName}!
                        </h2>
                        <p className="text-white/90 text-sm">{vehicleId}</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-white/80 text-xs mb-1">Ngày</p>
                    <p className="text-white font-semibold text-lg">{date}</p>
                </div>
            </div>
        </div>
    );
};