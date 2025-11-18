import type React from "react";
import { useEffect, useState, type JSX } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToastEventHandler = (element: JSX.Element, duration: number) => void;
const listeners = new Set<ToastEventHandler>();

interface ToastOptions<Key extends string = string> {
    defultDuration?: number;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
    customToasts: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [K in Key]: React.FC<any>;
    };
}

export type FireOptions<Props = object> = {
    duration?: number;
    id?: string;
} & Props;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Toast<Key extends string, Map extends Record<Key, React.FC<any>>>(
    options: ToastOptions<Key> & { customToasts: Map }
) {
    const toast = {} as {
        [K in keyof Map]: (toastOptions?: FireOptions<React.ComponentProps<Map[K]>>) => void;
    };

    for (const key in options.customToasts) {
        toast[key as keyof Map] = (toastOptions) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ToastComponent: React.FC<any> = options.customToasts[key as Key];
            const duration = toastOptions?.duration ?? options.defultDuration ?? 3000;
            const id = Math.random().toString(36).substr(2, 9);
            const newOptions = { ...toastOptions, id: id };
            const element = <ToastComponent {...newOptions} />;
            listeners.forEach((listener) => listener(element, duration));
        };
    }

    return toast;
}

interface ToastItem {
    element: JSX.Element;
    id: string;
    isExiting: boolean;
}

export function ToastContainer(): JSX.Element {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        const handler: ToastEventHandler = (element, duration) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const id = (element.props as any).id as string;
            
            setToasts((prevToasts) => [
                ...prevToasts,
                { element, id, isExiting: false }
            ]);

            // Start exit animation before removing
            setTimeout(() => {
                setToasts((prevToasts) =>
                    prevToasts.map((toast) =>
                        toast.id === id ? { ...toast, isExiting: true } : toast
                    )
                );
            }, duration - 300); // Start exit animation 300ms before removal

            // Remove toast after exit animation
            setTimeout(() => {
                setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
            }, duration);
        };

        listeners.add(handler);
        return () => {
            listeners.delete(handler);
        };
    }, []);

    return (
        <div className="fixed z-50 flex flex-col items-end p-4 pointer-events-none top-0 right-0 w-full">
            <div className="w-fit">hello</div>
            {toasts.map((toast) => {
                const keyId = toast.id + "item";
                return (
                    <div
                        key={keyId}
                        className={`pointer-events-auto w-fit ${
                            toast.isExiting
                                ? "animate-toast-exit"
                                : "animate-toast-enter"
                        }`}
                    >
                        {toast.element}
                    </div>
                );
            })}
        </div>
    );
}
