import React, { useEffect, useRef } from "react";
import barcode_ex from '../../assets/barcode_ex.png';

export const BarcodeScanFrame: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("Không truy cập được camera. Vui lòng cấp quyền!");
      }
    };
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-2 py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">Đưa thẻ sinh viên vào đây</h2>
      <div
        className="
          relative w-full max-w-md aspect-[16/10] bg-black rounded-2xl shadow-lg
          flex items-center justify-center overflow-hidden
          sm:max-w-lg md:max-w-xl min-h-[220px]
        "
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute w-full h-full object-cover"
        />
        {/* Khung màu cam */}
        <div className="absolute top-0 left-0 w-1/5 h-1/5 border-t-4 border-l-4 border-orange-500 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-1/5 h-1/5 border-t-4 border-r-4 border-orange-500 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-1/5 h-1/5 border-b-4 border-l-4 border-orange-500 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-1/5 h-1/5 border-b-4 border-r-4 border-orange-500 rounded-br-xl" />
      </div>
      <div className="text-center mt-5 text-slate-500 text-base">
        Hướng camera vào mã barcode trên thẻ sinh viên
        <div className="mt-3">
          <span className="italic text-sm text-gray-500">*Ví dụ:</span>
          <img
            src={barcode_ex}
            alt="barcode ví dụ"
            className="mx-auto mt-2 max-h-20 rounded shadow bg-white"
          />
        </div>
      </div>
    </div>
  );
};
