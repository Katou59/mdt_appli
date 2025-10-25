"use client";

import { useHistory } from "@/lib/Contexts/history-context";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

type Props = {
    children: ReactNode;
    title: string;
};
export default function Page({ children, title }: Props) {
    const router = useRouter();
    const { histories, deleteLast } = useHistory();

    return (
        <div className="flex flex-col h-full">
            <header>
                {histories.length > 1 && (
                    <Button
                        variant={"default"}
                        onClick={() => {
                            deleteLast();
                            router.push(histories[histories.length - 2]);
                        }}
                        className="absolute top-2 left-2">
                        Retour
                    </Button>
                )}
                <h1 className="text-4xl font-bold text-center my-4">{title}</h1>
            </header>
            <main className="flex flex-col items-center grow">{children}</main>
            <footer className="mt-8 pt-4 text-center text-sm text-primary-foreground/50 grid gap-2">
                <Separator />© 2025 MDT Application — Développé par Katou
            </footer>
        </div>
    );
}
