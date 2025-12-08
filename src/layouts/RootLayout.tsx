import { Outlet } from "react-router";
import { ApiProvider } from "../contexts/apiConetxt";
import { ModalProvider } from "../contexts/modalContext";
import { SocketProvider } from "../contexts/socketContext";
import { NotifyWrap } from "../components/uiPart/NotifyWrap";


export function RootLayout() {
    return <ApiProvider>
        <NotifyWrap>
            {
                // Provide Socket Context
                // NOTE: Adjust the URL as needed for your backend
                // You can set VITE_API_BASE_URL in your .env file
            }
            <SocketProvider url={import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}>
                <ModalProvider>
                    <Outlet />
                </ModalProvider>
            </SocketProvider>
        </NotifyWrap>
    </ApiProvider >
}
