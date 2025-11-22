import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router/index.tsx';
import { ToastContainer } from './components/uiPart/ToastContainer.tsx';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <>
            <QueryClientProvider client={queryClient}>
                <ToastContainer />
                <RouterProvider router={router} />
            </QueryClientProvider>
        </>
    </StrictMode>,
)
