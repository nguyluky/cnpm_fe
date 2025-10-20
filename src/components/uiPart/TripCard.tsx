import React, { useState } from "react";
import { Card } from "../uiItem/card";
import { Button } from "../uiItem/button";
import { Clock } from "lucide-react";

export interface Student {
  name: string;
  className: string;
}

export interface TripCardProps {
  index: number;
  location: string;
  time: string;
  students: Student[];
  onPickUp?: (student: Student) => void;
  onAbsent?: (student: Student) => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  index,
  location,
  time,
  students,
  onPickUp,
  onAbsent,
}) => {
  const [pickedStudents, setPickedStudents] = useState<string[]>([]);

  const handlePickUp = (student: Student) => {
    setPickedStudents((prev) => [...prev, student.name]);
    onPickUp?.(student);
  };

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold">
            {index}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm md:text-base">
              {location}
            </h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{time}</span>
            </div>
          </div>
        </div>

        {/* Danh sách học sinh */}
        <div className="space-y-3">
          {students.map((student, i) => {
            const isPicked = pickedStudents.includes(student.name);
            return (
              <div
                key={i}
                className="flex items-center justify-between bg-slate-50 rounded-xl p-5"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">
                      {student.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Lớp {student.className}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isPicked ? (
                    <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow bg-green-100 text-green-700 hover:bg-green-100">
                      Đã đón
                    </span>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 px-3"
                        onClick={() => handlePickUp(student)}
                      >
                        Đón
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-300 h-8 px-3"
                        onClick={() => onAbsent?.(student)}
                      >
                        Vắng
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
