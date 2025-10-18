import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
    title: string;
};
export default function Page({ children, title }: Props) {
    return (
        <div>
            <h1 className="text-4xl font-bold text-center my-4">
                {title}
            </h1>
            <div className="flex flex-col items-center justify-center">{children}</div>
        </div>
    );
}
