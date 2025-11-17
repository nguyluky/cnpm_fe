import React from "react";
import { Button } from "../uiItem/button";

interface WarnAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  message: string;
}

export const WarnAlert: React.FC<WarnAlertProps> = ({
  isOpen,
  onClose,
  onSubmit,
  message,
}) => {
  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-[500px] max-w-[90%]">
        <div className="flex items-center justify-center px-5 py-3">
          <h3 className="font-semibold text-slate-900">{message}</h3>
          {/* <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-lg"
          >
            ✕
          </button> */}
        </div>

        <div className="flex justify-center gap-3 px-5 py-4">
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
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
};
