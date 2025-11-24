import { Outlet } from "react-router";
import { ApiProvider } from "../contexts/apiConetxt";
import { ModalProvider } from "../contexts/modalContext";
import { SocketProvider } from "../contexts/socketContext";


export function RootLayout() {
    return <ApiProvider>
        <SocketProvider url={"http://localhost:3000"}>
            <ModalProvider>
                <Outlet />
            </ModalProvider>
        </SocketProvider>
    </ApiProvider>
}
