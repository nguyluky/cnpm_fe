import React, { useState } from "react";
// import { Card } from "../uiItem/card";
import { Button } from "../uiItem/button";

interface ReportAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string) => void;
}

export const ReportAlert: React.FC<ReportAlertProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (description.trim()) {
      onSubmit(description);
      setDescription("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-[500px] max-w-[90%]">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="font-semibold text-slate-900">Báo cáo sự cố</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          <textarea
            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            rows={4}
            placeholder="Mô tả sự cố..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 px-5 pb-4">
          <Button
            variant="outline"
            className="border-slate-300"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={handleSubmit}
          >
            Gửi báo cáo
          </Button>
        </div>
      </div>
    </div>
  );
};
