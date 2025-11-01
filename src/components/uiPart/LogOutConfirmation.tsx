import React, { useState } from "react";
import { Button } from "../uiItem/button";
import {useNavigate} from 'react-router-dom';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogOutConfirmation: React.FC<LogoutConfirmationProps> = ({
  isOpen,
  onClose,
}) => {

  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleLogout = () => {
	  onClose();
	  navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-[500px] max-w-[90%]">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="font-semibold text-slate-900">Bạn có chắc chắn muốn đăng xuất không?</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-end gap-3 px-5 pb-4">
          <Button
            variant="outline"
            className="border-slate-300"
            onClick={onClose}
          >
            Không
          </Button>
          <Button
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={handleLogout}
          >
            Có 
          </Button>
        </div>
      </div>
    </div>
  );
};

