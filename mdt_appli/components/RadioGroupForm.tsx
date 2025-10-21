import { Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { HTMLInputTypeAttribute } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { KeyValueType } from "@/types/utils/keyValue";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

export function RadioGroupForm<T extends object>({
    form,
    name,
    label,
    items,
}: {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    items: KeyValueType[];
}) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className="w-full">
                    <div className="h-5">
                        {fieldState.error ? <FormMessage /> : <FormLabel>{label}</FormLabel>}
                    </div>
                    <FormControl>
                        <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex flex-row"
                        >
                            {items.map((item) => (
                                <div key={item.key} className="flex items-center gap-3">
                                    <RadioGroupItem value={item.key} id={item.key} />
                                    <Label htmlFor={item.key}>{item.value}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
