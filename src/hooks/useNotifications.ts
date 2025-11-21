import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

type NotificationEvent =
  | 'NewNotification'
  | 'SystemAlert'
  | 'UserMentioned'
  | 'UserOnline';

interface RawNotification {
  type?: string;
  message?: string;
  timestamp?: string | number | Date;
  [k: string]: any;
}

export function useNotifications(onNotification: (data: RawNotification) => void) {
  // Keep a stable ref so we don't reconnect on every render
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Minimal polyfill (only if truly absent)
    if (typeof (window as any).global === 'undefined') {
      (window as any).global = window;
    }

    // Avoid duplicate connections
    if (socketRef.current) return;

    // Get and parse token container
    const raw = localStorage.getItem('securityData');
    if (!raw) {
      console.warn('[notifications] securityData missing in localStorage');
      return;
    }

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.warn('[notifications] securityData JSON parse failed:', e);
      return;
    }

    const token = parsed?.accessToken;
    if (!token) {
      console.warn('[notifications] accessToken missing');
      return;
    }

    // Establish socket (force websocket transport to skip polling branch)
    const socket = io('http://localhost:3000/notifications', {
      auth: { token },
      transports: ['websocket'],      // critical to bypass polling + xhr path
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ notifications connected, id:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ notifications connect_error:', err.message);
    });

    const events: NotificationEvent[] = [
      'NewNotification',
      'SystemAlert',
      'UserMentioned',
      'UserOnline',
    ];

    events.forEach((evt) => {
      socket.on(evt, (data: RawNotification) => {
        // Normalize timestamp
        if (data?.timestamp && typeof data.timestamp === 'string') {
          data.timestamp = new Date(data.timestamp);
        }
        console.log(`🔔 [${evt}]`, data);
        onNotification({ ...data, type: data.type ?? evt });
      });
    });

    return () => {
      if (socketRef.current) {
        console.log('🔌 notifications disconnect');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [onNotification]);

  return socketRef.current;
}