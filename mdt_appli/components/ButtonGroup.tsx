import React from "react";
import { Button } from "./ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "./ui/button-group";

type Props = {
    onCancel: () => void;
};

export default function ButtonGroupForm({ onCancel }: Props) {
    return (
        <ButtonGroup className="col-span-2 flex items-center justify-center w-full mt-4">
            <Button type="reset" className="w-30" variant={"cancel"} onClick={() => onCancel()}>
                Annuler
            </Button>
            <ButtonGroupSeparator />
            <Button type="submit" className="w-30" variant={"ok"}>
                Valider
            </Button>
        </ButtonGroup>
    );
}
