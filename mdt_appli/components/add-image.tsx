import { CircleX } from "lucide-react";
import Image from "next/image";
import React from "react";
import ShowImageDialog from "./show-image-dialog";

export default function AddImage(props: {
    image: string | null;
    onPaste: (file: File) => void;
    delete: () => void;
    title?: string;
}) {
    const handlePaste = async (e: React.ClipboardEvent) => {
        const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
        if (!item) return;
        const file = item.getAsFile();
        if (file) {
            props.onPaste(file);
        }
    };

    return (
        <div className="w-full">
            {!props.image ? (
                <div
                    onPaste={handlePaste}
                    tabIndex={0}
                    className="w-full h-[200px] border-2 border-dashed flex items-center justify-center cursor-pointer rounded-xl">
                    {props.title ? props.title : "Colle une image ici"}
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-center">
                        <ShowImageDialog url={props.image}>
                            <div className="w-[200px] h-[200px] relative">
                                <Image
                                    src={props.image}
                                    alt="Citizen Image"
                                    fill
                                    className="object-contain rounded-xl"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        props.delete();
                                    }}
                                    className="absolute top-2 right-2 rounded-full p-1"
                                    title="Supprimer l'image">
                                    <CircleX className="w-8 h-8 text-error hover:cursor-pointer rounded-full hover:scale-105 duration-200" />
                                </button>
                            </div>
                        </ShowImageDialog>
                    </div>
                </>
            )}
        </div>
    );
}
