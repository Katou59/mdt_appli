import Image from "next/image";
import React from "react";

export default function AddImage(props: {
    image: string | null;
    onPaste: (event: React.ClipboardEvent<HTMLDivElement>) => void;
    delete: () => void;
}) {
    return (
        <div>
            {!props.image ? (
                <div
                    onPaste={props.onPaste}
                    tabIndex={0}
                    className="w-full h-[200px] border-2 border-dashed flex items-center justify-center cursor-pointer rounded-xl"
                >
                    Colle une image ici
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-center">
                        <div
                            className="relative group inline-block rounded-xl overflow-hidden hover:cursor-pointer border-1"
                            onClick={() => {
                                const modal = document.getElementById(
                                    "showImage"
                                ) as HTMLDialogElement | null;
                                modal?.showModal();
                            }}
                        >
                            <div className="w-[200px] h-[200px] relative">
                                <Image
                                    src={props.image}
                                    alt="Citizen Image"
                                    fill
                                    className="object-contain rounded-xl"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    props.delete();
                                }}
                                className="btn btn-error btn-sm absolute top-2 right-2 rounded-full"
                                title="Supprimer l'image"
                            >
                                X
                            </button>
                        </div>
                    </div>
                    <dialog id="showImage" className="modal">
                        <div className="modal-box max-w-[800px] p-0 bg-base-100">
                            <div className="relative w-full h-[500px] flex justify-center items-center">
                                <Image
                                    src={props.image}
                                    alt="Citizen Image"
                                    fill
                                    className="object-contain rounded-xl"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        (
                                            document.getElementById(
                                                "my_modal_1"
                                            ) as HTMLDialogElement
                                        )?.close()
                                    }
                                    className="btn btn-error btn-circle absolute top-4 right-4"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </dialog>
                </>
            )}
        </div>
    );
}
