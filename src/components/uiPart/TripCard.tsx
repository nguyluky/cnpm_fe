import React from 'react';
// import { Clock } from 'lucide-react';
import { Card } from '../uiItem/card';
import { Avatar, AvatarFallback } from '../uiItem/avatar';
import { Button } from '../uiItem/button';
import type { Driver } from '../uiPart/ScheduleCard';

export interface TripCardProps {
    schoolName: string;
    time: string;
    drivers: Driver[];
    onStart?: () => void;
    onAbsent?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({
    schoolName,
    time,
    drivers,
    onStart,
    onAbsent
}) => {
    return (
        <Card className="bg-white">
            <div className="p-5">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Avatar className="w-8 h-8 bg-primary text-white font-bold">
                            <AvatarFallback className="bg-primary text-white text-xs">
                                T
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">{schoolName}</h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
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
                                <path d="M12 6v6l4-2" />
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>

                {/* Drivers */}
                <div className="space-y-3">
                    {drivers.map((driver, index) => (
                        <div key={index} className="flex items-center justify-between pb-3 border-b last:border-b-0 last:pb-0">
                            <div>
                                <p className="font-medium text-slate-900 text-sm">{driver.name}</p>
                                <p className="text-xs text-slate-500">{driver.role}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 px-3"
                                    onClick={onStart}
                                >
                                    Bắt
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-300 h-8 px-3"
                                    onClick={onAbsent}
                                >
                                    Vắng
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};