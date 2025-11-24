import { useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { SocketContext } from '../contexts/socketContext';


export function useSocketIo() {
    const { socket, connected } = useContext(SocketContext);

    return { socket, connected };
}
