import { Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { HTMLInputTypeAttribute } from "react";

export function InputForm<T extends object>({
    form,
    name,
    label,
    placeHolder,
    type,
}: {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeHolder: string;
    type?: HTMLInputTypeAttribute;
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
                        <Input type={type} placeholder={placeHolder} {...field} />
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
