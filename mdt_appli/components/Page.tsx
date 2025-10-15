import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
    title: string;
};
export default function Page({ children }: Props) {
    return (
        <>
            <h1 className="text-4xl font-bold text-center my-4">
                Liste des utilisateurs
            </h1>
            <div>{children}</div>
        </>
    );
}
