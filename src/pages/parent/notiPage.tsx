import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../components/uiItem/button.tsx";

const DB_NAME = "messages_db";
const DB_VERSION = 1;
const STORE_NAME = "messages_store";

function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as any).result as IDBDatabase;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            resolve(
                (event.target as any).result as IDBDatabase
            );
        };

        request.onerror = (event) => {
            reject(
                (event.target as any).error
            );
        };
    });
}


async function getAllMessages() {
    const db = await openDatabase();
    return new Promise<any[]>((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = (event) => {
            resolve((event.target as any).result as any[]);
        };

        request.onerror = (event) => {
            reject((event.target as any).error);
        };
    });
}

async function clearAllMessages() {
    const db = await openDatabase();
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject((event.target as any).error);
        };
    });
}


export function NotiPage() {

    const [notifications, setNotifications] = useState<any[]>([]);

    // save to local storage whenever notifications change
    useEffect(() => {
        // get notifycations from indedexedDB
        getAllMessages().then((msgs) => {
            console.log('Loaded messages from IndexedDB:', msgs);
            setNotifications(msgs);
        }).catch((err) => {
            console.error('Error loading messages from IndexedDB:', err);
        });

    }, [notifications]);

    const clearAllNotifications = () => {
        setNotifications([]);
        clearAllMessages().then(() => {
            console.log('All messages cleared from IndexedDB');
        }).catch((err) => {
            console.error('Error clearing messages from IndexedDB:', err);
        });
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
                            <p className="font-semibold">{notif.message.title}</p>
                            <p className="text-sm text-gray-600">{notif.message.message}</p>
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
