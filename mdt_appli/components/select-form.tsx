import { cn } from "@/lib/utils";
import { KeyValueType } from "@/types/utils/key-value";
import { Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

export function SelectForm<T extends object>({
    form,
    name,
    label,
    items,
    isRequired,
}: {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    items: KeyValueType[];
    isRequired?: boolean;
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
                            }}>
                            <SelectTrigger
                                aria-invalid={fieldState.invalid}
                                className={cn(
                                    "min-w-[120px] w-full data-[state=open]:ring-1 data-[state=open]:ring-ring",
                                    fieldState.invalid &&
                                        "border-destructive focus:ring-destructive"
                                )}>
                                <SelectValue placeholder="Choisir..." />
                            </SelectTrigger>
                            <SelectContent>
                                {!isRequired && (
                                    <>
                                        <SelectItem value="none">Aucun</SelectItem>
                                        <SelectSeparator />
                                    </>
                                )}
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
