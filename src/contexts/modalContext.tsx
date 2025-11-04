// src/contexts/ModalProvider.js
import React, { useState, useContext, createContext } from 'react';
import Modal from '../components/uiItem/Modal';

const ModalContext = createContext<{
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}>(null!);

export const ModalProvider = ({ children }: {
    children: React.ReactNode;
}) => {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  // Hàm để mở modal, nhận nội dung (JSX) làm tham số
  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
  };

  // Hàm để đóng modal
  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children} {/* Đây là phần còn lại của ứng dụng (ví dụ: <App />) */}

      {/* Render Modal (với Portal) ngay tại đây.
        Nó chỉ hiển thị khi modalContent không phải là null.
      */}
      {modalContent && (
        <Modal onClose={closeModal}>
          {modalContent}
        </Modal>
      )}
    </ModalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal phải được dùng bên trong một ModalProvider');
  }
  return context;
};
