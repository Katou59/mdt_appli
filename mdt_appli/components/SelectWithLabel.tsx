import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";

type Props = {
    label: string;
    id: string;
    items: { value: string; label: string }[];
    value: string;
    onValueChange: (value: string) => void;
    defaultValue?: string;
    className?: string;
    disable?: boolean;
    isRequired?: boolean;
};
export default function SelectWithLabel({
    label,
    id,
    items,
    value,
    onValueChange,
    className,
}: Props) {
    return (
        <div className="grid items-center gap-1">
            <Label htmlFor={id}>{label}</Label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className={className}>
                    <SelectValue placeholder={"Choisir..."} />
                </SelectTrigger>
                <SelectContent className={className}>
                    {items?.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
