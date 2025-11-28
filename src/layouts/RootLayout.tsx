import { Outlet } from "react-router";
import { ApiProvider } from "../contexts/apiConetxt";
import { ModalProvider } from "../contexts/modalContext";
import { SocketProvider } from "../contexts/socketContext";


export function RootLayout() {
    return <ApiProvider>
        <SocketProvider url={ import.meta.env.VITE_API_BASE_URL || "http://localhost:3000" }>
            <ModalProvider>
                <Outlet />
            </ModalProvider>
        </SocketProvider>
    </ApiProvider>
}
