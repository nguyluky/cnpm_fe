import React from "react";
import { WelcomeBanner } from "../../components/uiPart/WelcomeBanner";
import { TripCard } from "../../components/uiPart/TripCard";
import { QuickInfoSidebar } from "../../components/uiPart/QuickInfoSidebar";
import { Card } from "../../components/uiItem/card";
import { toast } from "sonner";
import { Clock, MapPin, Sun, Sunset } from "lucide-react";
import type { Student } from "../../components/uiPart/TripCard";

export const Bus: React.FC = () => {


  // Xử lý sự kiện
  const handlePickUp = (student: Student) =>
    toast.success(`✅ Đã đón ${student.name}`);
  const handleAbsent = (student: Student) =>
    toast.info(`📋 ${student.name} vắng mặt`);

  return (
    <div className="p-6">
      
      </div>
  );
};
