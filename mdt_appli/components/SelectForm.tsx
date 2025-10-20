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

export function SelectForm<T extends object>({
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
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value);
                            }}
                        >
                            <SelectTrigger
                                aria-invalid={fieldState.invalid}
                                className={cn(
                                    "min-w-[120px] w-full data-[state=open]:ring-1 data-[state=open]:ring-ring",
                                    fieldState.invalid &&
                                        "border-destructive focus:ring-destructive"
                                )}
                            >
                                <SelectValue placeholder="Choisir..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Tous</SelectItem>
                                <SelectSeparator />
                                {items?.map((item) => (
                                    <SelectItem key={item.key} value={item.key}>
                                        {item.value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
