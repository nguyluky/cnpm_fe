import { Outlet } from "react-router";
import { ApiProvider } from "../contexts/apiConetxt";
import { ModalProvider } from "../contexts/modalContext";


export function RootLayout() {
    return <ApiProvider>
        <ModalProvider>
            <Outlet />
        </ModalProvider>
    </ApiProvider>
}
