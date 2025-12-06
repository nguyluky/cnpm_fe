import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../components/uiItem/button.tsx";
import { useSocketIo } from "../../hooks/useSocketIo.ts";

const NOTIFICATIONS_KEY = 'parent_notifications'; // AI generated

export function NotiPage() {

  // AI Generated: save notifications to local storage
  const [notifications, setNotifications] = useState<any[]>(() => {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  
  const { socket, connected } = useSocketIo();

  // save to local storage whenever notifications change
  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (!socket || !connected) return;
    console.log('Socket connected:', connected);
    console.log('Socket object:', socket);
    // Listen for new notifications from backend
    socket.on('NewNotification', (data) => {
      console.log('Received notification:', data);
      setNotifications(prev => {
        const newNotifications = [data, ...prev];
        return newNotifications.slice(0, 50);
      }); // Add to top of list
    });

    // Cleanup when component unmounts
    return () => {
      socket.off('NewNotification');
    };
  }, [socket, connected]);

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem(NOTIFICATIONS_KEY);
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* ...your existing header... */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Thông báo</h1>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllNotifications}
              className="text-sm text-red-600"
            >
              Xóa tất cả
            </Button>
          )}
        </div>
      </div>
      
      <div className="px-4 pt-4 pb-24">
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
}
