import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import AddRankForm, { AddRankFormType } from "./AddRankForm";

type Props = {
    children?: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: AddRankFormType) => void;
};

export default function DialogAddRank({ children, isOpen, onClose, onSubmit }: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Création d&apos;un nouveau grade</DialogTitle>
                </DialogHeader>
                <AddRankForm
                    onCancel={() => {
                        onClose();
                    }}
                    onSubmit={(value: AddRankFormType) => {
                        onSubmit(value);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
