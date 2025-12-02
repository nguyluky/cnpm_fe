import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router/index.tsx';
import { ToastContainer } from './components/uiPart/ToastContainer.tsx';
import {
    QueryClientProvider,
} from '@tanstack/react-query'
import { SocketProvider } from './contexts/socketContext.tsx';
import { queryClient } from './utils/queryClient.ts';


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <>
            <SocketProvider url={"http://localhost:3000/notifications"}>
                <QueryClientProvider client={queryClient}>
                    <ToastContainer />
                    <RouterProvider router={router} />
                </QueryClientProvider>
            </SocketProvider>
        </>
    </StrictMode>,
)
