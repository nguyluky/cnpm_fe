import { Outlet } from "react-router";
import { ApiProvider } from "../contexts/apiConetxt";


export function RootLayout() {
    return <ApiProvider>
        <Outlet />
    </ApiProvider>
}
