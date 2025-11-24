/* eslint-disable @typescript-eslint/no-explicit-any */

// src/contexts/SocketContext.tsx
import {
    createContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";

interface SocketEvents {
    joinNotificationRoom: (accessToken: string) => void;
    joinTripRoom: (tripId: string) => void;
    NewNotification: (notification: any) => void;
    LiveLocationUpdate: (location: { lat: number; lng: number }) => void;
    SystemAlert: (message: string) => void;
}

interface SocketEmits {
    NewNotification: (notification: any) => void;
    LiveLocationUpdate: (location: { lat: number; lng: number }) => void;
    SystemAlert: (message: string) => void;
    UpdateLocation: (location: { lat: number; lng: number }) => void;
    Success: () => void;
}


interface SocketContextValue {
    socket: Socket<SocketEmits, SocketEvents> | null;
    connected: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext<SocketContextValue>({
    socket: null,
    connected: false,
});

export const SocketProvider = ({
    url,
    options,
    children,
}: {
    url: string;
    options?: any;
    children: ReactNode;
}) => {
    const [connected, setConnected] = useState(false);
    const socketRef = useRef<Socket<SocketEmits, SocketEvents> | null>(null);
    const [socket, setSocket] = useState<Socket<SocketEmits, SocketEvents> | null>(null);


    useEffect(() => {
        const s = io(url, {
            transports: ["websocket"],
            autoConnect: true,
        });

        socketRef.current = s;
        setSocket(s);

        s.on("connect", () => {
            setConnected(true);
            console.log("🔌 Socket connected:", s.id);
        });

        s.on("connect_error", (err) => {
            console.error("⚠️ Socket connection error:", err.message);
        });

        s.on("disconnect", () => {
            setConnected(false);
            console.log("❌ Socket disconnected");
        });

        return () => {
            s.disconnect();
        };
    }, [options, url]);

    return (
        <SocketContext.Provider
            value={{
                socket: socket,
                connected,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};


