import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
    title: string;
};
export default function Page({ children, title }: Props) {
    return (
        <div className="flex flex-col h-full">
            <header>
                <h1 className="text-4xl font-bold text-center my-4">{title}</h1>
            </header>
            <main className="flex flex-col items-center grow">{children}</main>
            <footer className="mt-8 pt-4 text-center text-sm text-gray-500 border-t">
                © 2025 MDT Application — Développé par Katou
            </footer>
        </div>
    );
}
