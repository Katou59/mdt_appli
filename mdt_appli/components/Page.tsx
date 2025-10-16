import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
    title: string;
};
export default function Page({ children, title }: Props) {
    return (
        <>
            <h1 className="text-4xl font-bold text-center my-4">
                {title}
            </h1>
            <div>{children}</div>
        </>
    );
}
