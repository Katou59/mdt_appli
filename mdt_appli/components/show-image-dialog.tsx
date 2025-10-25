"use client";

import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent } from "./ui/dialog";

type Props = {
    children: React.ReactNode;
    url: string;
};
export default function ShowImageDialog({ children, url }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="hover:cursor-pointer">{children}</div>
            </DialogTrigger>
            <DialogContent className="data-[state=open]:!zoom-in-0 data-[state=open]:duration-600 sm:w-2/3 sm:h-3/4 h-full w-full p-5">
                <DialogTitle></DialogTitle>
                <Avatar className="rounded-sm w-auto h-auto p-0">
                    <AvatarImage src={url} alt="Image profil" className="rounded-sm" />
                </Avatar>
            </DialogContent>
        </Dialog>
    );
}
