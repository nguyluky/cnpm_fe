import { useContext } from 'react';
import { SocketContext } from '../contexts/socketContext';


export function useSocketIo() {
    const { socket, connected } = useContext(SocketContext);

    return { socket, connected };
}
