import { useEffect } from 'react';
import { useSocketIo } from '../../hooks/useSocketIo';
import { useApi } from '../../contexts/apiConetxt';
import { useState } from 'react';
//
export default function NotificationsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [notifications, setNotifications] = useState<any[]>([]);
    const { socket } = useSocketIo();
    const api = useApi();

    useEffect(() => {
        if (!socket) return;

        const handleNotification = (data: any) => {
            setNotifications((prevNotifs) => [
                {
                    type: data.type,
                    message: data.message,
                    data: data.data || null,
                    timestamp: Date.now(),
                },
                ...prevNotifs,
            ]);
        };

        socket.emit('joinNotificationRoom', api.securityData?.accessToken || '');
        socket.on('NewNotification', handleNotification);

    }, [api.securityData?.accessToken, socket]);


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>

            {notifications.length === 0 ? (
                <p className="text-gray-500">No notifications yet</p>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-blue-600">{notif.type}</p>
                                    <p className="text-gray-700 mt-1">{notif.message}</p>
                                    {notif.data && (
                                        <pre className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                                            {JSON.stringify(notif.data, null, 2)}
                                        </pre>
                                    )}
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(notif.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
