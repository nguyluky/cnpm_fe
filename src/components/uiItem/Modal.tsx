

// Modal.js
import React, { useEffect } from 'react';
import { useRef } from 'react';
import ReactDOM from 'react-dom';

// Lấy DOM node từ file HTML
const modalRoot = document.getElementById('modal-root')!;

const Modal = ({ 
    children,
    onClose,
}: {
    children: React.ReactNode;
    onClose?: () => void;
    enableClickOutsideToClose?: boolean;
}) => {
    const modalContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
                // Nếu click bên ngoài modalContent, ta có thể gọi hàm đóng modal ở đây
                console.log('Clicked outside modal content');
                if (onClose) {
                    onClose();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Sử dụng createPortal để "dịch chuyển" children vào modalRoot
    return ReactDOM.createPortal(
        <div tabIndex={-1} className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full flex justify-center items-center bg-gray-900/80">
            <div className="relative max-h-full w-fit" ref={modalContentRef}>
                {children}
            </div>
        </div>
        ,
        modalRoot // Nơi render
    );
};

export default Modal;
