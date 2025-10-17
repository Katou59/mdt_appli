import React from "react";
import { Button } from "./ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "./ui/button-group";

type Props = {
    onCancel: () => void;
};

export default function ButtonGroupForm({ onCancel }: Props) {
    return (
        <ButtonGroup className="w-full mt-4">
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
