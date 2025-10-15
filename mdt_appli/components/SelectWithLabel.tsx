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
};
export default function SelectWithLabel({
    label,
    id,
    items,
    value,
    onValueChange,
    defaultValue,
    className,
    disable,
}: Props) {
    return (
        <div className="grid items-center gap-1">
            <Label htmlFor={id}>{label}</Label>
            <Select value={value} onValueChange={onValueChange} disabled={disable}>
                <SelectTrigger className={className}>
                    <SelectValue placeholder={defaultValue} />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="none">{defaultValue}</SelectItem>
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
