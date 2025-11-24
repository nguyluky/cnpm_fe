// import { Card } from '../../components/uiItem/card.tsx';
import { Button } from "../../components/uiItem/button.tsx";
import { Bell, ChevronLeft, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSocketIo } from "../../hooks/useSocketIo.ts";

export function NotiPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { socket, connected } = useSocketIo();

  useEffect(() => {
    if (!socket || !connected) return;
    console.log('Socket connected:', connected);
    console.log('Socket object:', socket);
    // Listen for new notifications from backend
    socket.on('NewNotification', (data) => {
      console.log('Received notification:', data);
      setNotifications(prev => [data, ...prev]); // Add to top of list
    });

    // Cleanup when component unmounts
    return () => {
      socket.off('NewNotification');
    };
  }, [socket, connected]);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* ...your existing header... */}
      
      <div className="px-4 pt-4 pb-24">
        <Button 
          onClick={() => {
            // Simulate receiving a notification (for testing UI only)
            const testData = {
              type: 'BusArrived',
              message: 'Test: Xe bus đã đến!',
              timestamp: new Date().toISOString()
            };
            console.log('Simulating notification:', testData);
            setNotifications(prev => [testData, ...prev]);
          }}
          className="mb-4"
        >
          Simulate Test Notification
        </Button>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400">
            <Bell className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Chưa có thông báo mới</p>
          </div>
        ) : (
          notifications.map((notif, index) => (
            <div key={index} className="mb-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="font-semibold">{notif.type}</p>
              <p className="text-sm text-gray-600">{notif.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notif.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // return (
  //   <div className="min-h-screen bg-gray-50">
  //     {/* Header cố định */}
  //     <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
  //       <div className="flex items-center justify-between px-4 py-4">
  //         <Button variant="ghost" size="icon" className="rounded-full">
  //           <ChevronLeft className="w-6 h-6" />
  //         </Button>

  //         <h1 className="text-xl font-bold text-gray-900">Thông báo</h1>

  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           className="text-sm font-medium text-blue-600"
  //         >
  //           <CheckCircle2 className="w-4 h-4 mr-1" />
  //           Đánh dấu đã đọc
  //         </Button>
  //       </div>
  //     </div>

  //     {/* Danh sách thông báo */}
  //     <div className="px-4 pt-4 pb-24">
  //       {" "}
  //       {/* pb-24 để chừa chỗ cho bottom nav nếu có */}
  //       {/* Thông báo khẩn - sắp đến */}
  //       <div className="mb-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-l-yellow-400 rounded-r-xl p-4 shadow-sm animate-pulse">
  //         <div className="flex items-start gap-3">
  //           <div className="mt-0.5">
  //             <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
  //               <Bell className="w-6 h-6 text-yellow-700" />
  //             </div>
  //           </div>
  //           <div className="flex-1">
  //             <p className="font-semibold text-gray-900 text-base">
  //               Xe bus sẽ đến đón trong 5 phút
  //             </p>
  //             <p className="text-xs text-gray-500 mt-1">1 phút trước</p>
  //           </div>
  //           <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
  //         </div>
  //       </div>
  //       {/* Thông báo thành công */}
  //       <div className="mb-4 bg-green-50 border-l-4 border-l-green-500 rounded-r-xl p-4 shadow-sm">
  //         <div className="flex items-start gap-3">
  //           <div className="mt-0.5">
  //             <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
  //               <svg
  //                 className="w-6 h-6 text-green-700"
  //                 fill="none Stoke"
  //                 viewBox="0 0 24 24"
  //               >
  //                 <path
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                   strokeWidth={2.5}
  //                   d="M5 13l4 4L19 7"
  //                 />
  //               </svg>
  //             </div>
  //           </div>
  //           <div className="flex-1">
  //             <p className="font-semibold text-gray-900 text-base">
  //               Học sinh đã lên xe an toàn
  //             </p>
  //             <p className="text-xs text-gray-500 mt-1">1 phút trước</p>
  //           </div>
  //         </div>
  //       </div>
  //       {/* Thông báo bình thường (ví dụ thêm) */}
  //       <div className="mb-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
  //         <div className="flex items-start gap-3">
  //           <div className="mt-0.5">
  //             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
  //               <Bell className="w-5 h-5 text-blue-600" />
  //             </div>
  //           </div>
  //           <div className="flex-1">
  //             <p className="font-medium text-gray-800">Xe đã đến trường</p>
  //             <p className="text-xs text-gray-500 mt-1">10 phút trước</p>
  //           </div>
  //         </div>
  //       </div>
  //       {/* Có thể thêm nhiều thông báo nữa... */}
  //     </div>

  //     {/* Empty state (khi không có thông báo mới) - có thể dùng sau */}
  //     {/* <div className="flex flex-col items-center justify-center h-96 text-gray-400">
  //       <Bell className="w-16 h-16 mb-4 opacity-50" />
  //       <p className="text-lg font-medium">Chưa có thông báo mới</p>
  //       <p className="text-sm">Chúng tôi sẽ thông báo ngay khi có cập nhật</p>
  //     </div> */}
  //   </div>
  // );
}
