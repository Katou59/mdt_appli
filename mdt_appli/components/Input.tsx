import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

;
export default function InputWithLabel({label, ...props }: {label?: string} & React.ComponentProps<"input">) {
    return (
        <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor={props.id}>{label}</Label>
            <Input {...props} />
        </div>
    );
}
