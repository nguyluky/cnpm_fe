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
            // Provide Socket Context
        // NOTE: Adjust the URL as needed for your backend
        // You can set VITE_API_BASE_URL in your .env file
        <SocketProvider url={import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}>
            <QueryClientProvider client={queryClient}>
                <ToastContainer />
                <RouterProvider router={router} />
            </QueryClientProvider>
        </SocketProvider>
    </StrictMode>,
)
