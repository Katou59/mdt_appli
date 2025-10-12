"use client";

import { useEffect, useState } from "react";

type ToastMessage = {
    id: number;
    message: string;
    type: "success" | "info";
};

export default function Toast(props: { message: string; type: "success" | "info" }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [idCounter, setIdCounter] = useState(0);

    useEffect(() => {
        if (!props.message) return;

        const newId = idCounter + 1;
        setIdCounter(newId);

        const newToast: ToastMessage = {
            id: newId,
            message: props.message,
            type: props.type,
        };

        setToasts((prev) => [...prev, newToast]);

        const timer = setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== newId));
        }, 5000);

        return () => clearTimeout(timer);
    }, [idCounter, props.message, props.type]);

    if (toasts.length === 0) return null;

    return (
        <div className="toast toast-end">
            {toasts.map((toast) => {
                if (toast.type === "success") {
                    return (
                        <div key={toast.id} className={`alert alert-success font-bold mb-2`}>
                            <span>{toast.message}</span>
                        </div>
                    );
                }

                return (
                    <div key={toast.id} className={`alert alert-info font-bold mb-2`}>
                        <span>{toast.message}</span>
                    </div>
                );
            })}
        </div>
    );
}
