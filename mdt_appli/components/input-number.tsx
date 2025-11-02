"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { Button, Group, Input, NumberField } from "react-aria-components";
import { Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

export function InputNumber<T extends object>({
    form,
    name,
    label,
    placeHolder,
    min,
    max,
}: {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeHolder: string;
    min?: number;
    max?: number;
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
                    <FormControl className="w-full">
                        <NumberField
                            value={field.value}
                            formatOptions={{ useGrouping: false }}
                            onChange={(value) => field.onChange(value ?? 0)}
                            onBlur={field.onBlur}
                            name={field.name}
                            minValue={min}
                            maxValue={max}
                            className="w-full space-y-2">
                            <Group className="w-full dark:bg-input/30 border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 min-w-0 items-center overflow-hidden rounded-md border bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-within:ring-[3px] md:text-sm">
                                <Input
                                    placeholder={placeHolder}
                                    className="selection:bg-primary selection:text-primary-foreground w-full grow px-3 py-2 tabular-nums outline-none"
                                    inputMode="numeric"
                                />
                                <Button
                                    slot="decrement"
                                    className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground mr-1.5 flex aspect-square h-5 items-center justify-center rounded-sm border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50">
                                    <MinusIcon className="size-3" />
                                    <span className="sr-only">Decrement</span>
                                </Button>
                                <Button
                                    slot="increment"
                                    className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground mr-2 flex aspect-square h-5 items-center justify-center rounded-sm border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50">
                                    <PlusIcon className="size-3" />
                                    <span className="sr-only">Increment</span>
                                </Button>
                            </Group>
                        </NumberField>
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
