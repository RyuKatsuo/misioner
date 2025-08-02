import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import { CheckIcon, XIcon } from 'lucide-react';


interface RadixToastProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    message: string;
    variant?: 'success' | 'error';
}

export function RadixToast({ open, onOpenChange,     title = 'Notification', message, variant = 'success' }: RadixToastProps) {
    const bgColor = variant === 'success' ? 'bg-[#4CCB8F]' : 'bg-red-600';

    return (
        <Toast.Provider swipeDirection="right">
            <Toast.Root
                open={open}
                onOpenChange={onOpenChange}
                className={`${bgColor} text-white rounded-md px-4 py-2 shadow-lg fixed top-4 right-4 z-50`}
            >
                {variant === 'success' ? (
                    <CheckIcon className="absolute top-2 right-2 text-white" />
                ) : (
                    <XIcon className="absolute top-2 right-2 text-white" />
                )}
                <Toast.Title className="font-bold">{title}</Toast.Title>
                <Toast.Description>{message}</Toast.Description>
            </Toast.Root>

            <Toast.Viewport className="fixed top-4 right-4 z-50 w-[320px] outline-none" />
        </Toast.Provider>
    );
}
