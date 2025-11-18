import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router/index.tsx';
import { ToastContainer } from './components/uiPart/ToastContainer.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <>
            <ToastContainer />
            <RouterProvider router={router} />
        </>
    </StrictMode>,
)
