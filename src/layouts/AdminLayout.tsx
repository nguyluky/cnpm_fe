
import 'mapbox-gl/dist/mapbox-gl.css';
import { Outlet } from 'react-router';
import { Sidebar } from "../components/uiPart/Sidebar";
import { useApi } from '../contexts/apiConetxt';
import { Forbidden } from '../pages/403Page';

export function AdminLayout() {
    const {api} = useApi();

    const securityData = api.getSecurityData();
    if (!securityData || securityData.roles.indexOf('admin') <= -1) {
        return <Forbidden />;
    }

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar role="admin" />
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div >
        </div>
    );
}
