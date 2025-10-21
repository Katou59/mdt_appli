import { Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { HTMLInputTypeAttribute } from "react";
import { Textarea } from "./ui/textarea";

export function TextareaForm<T extends object>({
    form,
    name,
    label,
    placeHolder,
}: {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeHolder: string;
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
                        <Textarea placeholder={placeHolder} {...field} />
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
