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
                    className="w-full h-52 border-2 border-dashed flex items-center justify-center cursor-pointer rounded-xl"
                >
                    Colle une image ici
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-center">
                        <div
                            className="relative group inline-block rounded-xl overflow-hidden hover:cursor-pointer"
                            onClick={() => {
                                const modal = document.getElementById(
                                    "my_modal_1"
                                ) as HTMLDialogElement | null;
                                modal?.showModal();
                            }}
                        >
                            <Image
                                width={200}
                                height={200}
                                src={props.image}
                                alt="Citizen Image"
                                className="block rounded-xl"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    props.delete();
                                }}
                                className="btn btn-error btn-outline btn-sm absolute top-2 right-2 rounded-full"
                            >
                                X
                            </button>
                        </div>
                    </div>
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box w-1/2 min-w-1/2">
                            <Image
                                width={1000}
                                height={1000}
                                src={props.image}
                                alt="Citizen Image"
                                className="block rounded-xl"
                            />
                            <div className="modal-action">
                                <form method="dialog">
                                    <button className="btn btn-error rounded-xl">Fermer</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </>
            )}
        </div>
    );
}
