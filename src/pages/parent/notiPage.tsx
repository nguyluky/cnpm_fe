import { Button } from "../../components/uiItem/button.tsx";
import { Bell } from "lucide-react";
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
}
