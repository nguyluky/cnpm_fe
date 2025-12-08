import 'mapbox-gl/dist/mapbox-gl.css';
import { NavLink, Outlet } from 'react-router';
import { path } from '../router';

// mobile ui
export function ParentLayout() {
    return (
        <div className="h-screen bg-slate-50 relative">
            <div className="overflow-y-auto h-full">
                <Outlet />
            </div>

            <nav className="absolute flex bottom-0 left-0 right-0 h-16 z-10 bg-white border-t border-slate-200 items-center justify-around md:hidden ">
                <NavLink to={path.PARENT} 
                    end={true}
                    className={
                    ({ isActive }) => isActive ? "flex flex-col items-center text-blue-600" : "flex flex-col items-center text-slate-600"
                }>
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    <span className="text-xs">Home</span>
                </NavLink>
                <NavLink to={path.PARENT_NOTIFICATIONS} className={
                    ({ isActive }) => isActive ? "flex flex-col items-center text-blue-600" : "flex flex-col items-center text-slate-600"
                }>
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    <span className="text-xs">Notifications</span>
                </NavLink>
                <NavLink to={path.PARENT_CHILD_INFO} className={
                    ({ isActive }) => isActive ? "flex flex-col items-center text-blue-600" : "flex flex-col items-center text-slate-600"
                }>
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="text-xs">Profile</span>
                </NavLink>
            </nav>

        </div>
    );

}
