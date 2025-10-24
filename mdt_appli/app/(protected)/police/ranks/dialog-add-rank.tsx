import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddRankForm, { AddRankFormType } from "./form-add-rank";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: AddRankFormType) => void;
};

export default function DialogAddRank({ isOpen, onClose, onSubmit }: Props) {
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
