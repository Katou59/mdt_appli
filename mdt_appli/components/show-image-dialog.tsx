"use client";

import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "./ui/dialog";

type Props = {
    children: React.ReactNode;
    url: string;
};
export default function ShowImageDialog({ children, url }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="bg-transparent fixed !left-0 !top-0 !translate-x-0 !translate-y-0 !m-0 !p-20 !w-screen !h-screen !max-w-none !max-h-none !rounded-none !border-0 overflow-hidden flex items-center justify-center">
                <DialogTitle />
                <img src={url} className="max-w-full max-h-full object-contain" alt="image" />{" "}
            </DialogContent>
        </Dialog>
    );
}
