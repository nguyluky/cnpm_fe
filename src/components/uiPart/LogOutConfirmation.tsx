import React from "react";
import { useNavigate } from 'react-router-dom';
import { useApi } from "../../contexts/apiConetxt";
import { useModal } from "../../contexts/modalContext";


interface LogoutConfirmationProps {
}

export const LogOutConfirmation: React.FC<LogoutConfirmationProps> = () => {
    const api = useApi();
    const { closeModal: onClose } = useModal();

    const navigate = useNavigate();

    const handleLogout = () => {
        api.api.setSecurityData(null);
        onClose();
        navigate('/login');
    };

    return (
        <div className="relative bg-white rounded-lg shadow-sm ">
            <div className="p-4 md:p-5 text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 ">Bạn có chắc là muốn đăng xuất khỗng</h3>
                <button onClick={handleLogout} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                    Yes, I'm sure
                </button>
                <button onClick={onClose} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100      ">No, cancel</button>
            </div>
        </div>
    );
};

