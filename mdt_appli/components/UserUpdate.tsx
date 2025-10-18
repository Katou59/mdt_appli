import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserToUpdateType, UserType } from "@/types/db/user";
import dayjs from "dayjs";
import React from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import ButtonGroupForm from "./ButtonGroup";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { ItemForm } from "./ItemForm";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import UserCard from "./UserCard";
import { stringToNumber } from "@/lib/converters";

const formSchema = z.object({
    firstName: z.string().max(50, "Le prénom ne peut pas dépasser 50 caractères").optional(),
    lastName: z.string().max(50, "Le nom ne peut pas dépasser 50 caractères").optional(),
    number: z.number().min(0).optional(),
    phoneNumber: z.string().optional(),
    jobId: z.string().optional(),
    rankId: z.string().optional(),
    roleId: z.string().optional(),
    isDisable: z.boolean(),
});

export default function UserUpdate({
    userToUpdate,
    isAdmin,
    jobs = [],
    ranks = [],
    roles = [],
    onJobChange,
    onSubmit,
    onCancel,
}: {
    userToUpdate: UserType;
    isAdmin?: boolean;
    jobs?: { label: string; value: string }[];
    ranks?: { label: string; value: string }[];
    roles?: { label: string; value: string }[];
    onJobChange?: (jobId: string) => void;
    onSubmit: (values: UserToUpdateType) => Promise<void>;
    onCancel?: () => void;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: userToUpdate.firstName || "",
            lastName: userToUpdate.lastName || "",
            number: userToUpdate.number || undefined,
            phoneNumber: userToUpdate.phoneNumber || "",
            jobId: userToUpdate.rank?.job?.id ? String(userToUpdate.rank.job.id) : undefined,
            rankId: userToUpdate.rank?.id ? String(userToUpdate.rank.id) : "",
            roleId: userToUpdate.role?.key !== undefined ? String(userToUpdate.role.key) : "",
            isDisable: userToUpdate.isDisable || false,
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });

    async function onSubmitInternal(values: z.infer<typeof formSchema>) {
        await onSubmit({
            firstName: values.firstName,
            lastName: values.lastName,
            number: values.number,
            phoneNumber: values.phoneNumber,
            jobId: stringToNumber(values.jobId),
            rankId: stringToNumber(values.rankId),
            isDisable: values.isDisable,
            roleId: stringToNumber(values.roleId),
            id: userToUpdate.id,
        });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmitInternal)}
                className="flex w-full max-w-lg flex-col gap-6"
            >
                <Tabs defaultValue="hrp">
                    <TabsList>
                        <TabsTrigger value="hrp">Informations HRP</TabsTrigger>
                        <TabsTrigger value="rp">Informations RP</TabsTrigger>
                    </TabsList>
                    <TabsContent value="hrp">
                        <UserCard
                            title="Informations HRP"
                            description="Informations relatives à la gestion du compte utilisateur."
                        >
                            <ItemForm title="Id Discord" description={userToUpdate.id} />
                            <ItemForm
                                title="Nom Discord"
                                description={userToUpdate.name ?? "Vide"}
                            />
                            <ItemForm
                                title="Adresse e-mail"
                                description={userToUpdate.email ?? "Vide"}
                            />
                            {!isAdmin ? (
                                <ItemForm
                                    title="Rôle"
                                    description={userToUpdate.role.value ?? "Vide"}
                                />
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="roleId"
                                    render={({ field, fieldState }) => (
                                        <FormItem
                                            data-invalid={fieldState.invalid}
                                            className="gap-0"
                                        >
                                            <div className="h-5">
                                                {fieldState.error ? (
                                                    <FormMessage />
                                                ) : (
                                                    <FormLabel>Rôle</FormLabel>
                                                )}
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
                                                        className={`${cn(
                                                            "min-w-[120px]",
                                                            fieldState.invalid &&
                                                                "border-destructive focus:ring-destructive"
                                                        )} w-full`}
                                                    >
                                                        <SelectValue placeholder="Choisir..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {roles.map((role) => (
                                                            <SelectItem
                                                                key={role.value}
                                                                value={role.value}
                                                            >
                                                                {role.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}
                            {!isAdmin ? (
                                <ItemForm
                                    title="Statut"
                                    description={userToUpdate.isDisable ? "Désactivé" : "Actif"}
                                />
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="isDisable"
                                    render={({ field, fieldState }) => (
                                        <FormItem
                                            data-invalid={fieldState.invalid}
                                            className="gap-0"
                                        >
                                            <div className="h-5">
                                                {fieldState.error ? (
                                                    <FormMessage />
                                                ) : (
                                                    <FormLabel>Statut</FormLabel>
                                                )}
                                            </div>
                                            <FormControl>
                                                <RadioGroup
                                                    defaultValue={String(field.value)}
                                                    onValueChange={(value) => {
                                                        field.onChange(value === "true");
                                                    }}
                                                    className="flex gap-8"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <RadioGroupItem value="true" id="r1" />
                                                        <Label htmlFor="r1">Désactivé</Label>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <RadioGroupItem value="false" id="r2" />
                                                        <Label htmlFor="r2">Activé</Label>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}
                            <ItemForm
                                title="Date de création"
                                description={dayjs(userToUpdate.createdAt).format(
                                    "DD/MM/YYYY HH:mm:ss"
                                )}
                            />
                            <ItemForm
                                title="Première connexion"
                                description={dayjs(userToUpdate.firstLogin).format(
                                    "DD/MM/YYYY HH:mm:ss"
                                )}
                            />
                            <ItemForm
                                title="Dernière connexion"
                                description={
                                    userToUpdate.lastLogin
                                        ? dayjs(userToUpdate.lastLogin).format(
                                              "DD/MM/YYYY HH:mm:ss"
                                          )
                                        : "Jamais connecté"
                                }
                            />
                        </UserCard>
                    </TabsContent>
                    <TabsContent value="rp">
                        <UserCard
                            title="Informations RP"
                            description="Informations relatives au personnage."
                        >
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <div className="h-5">
                                            {fieldState.error ? (
                                                <FormMessage />
                                            ) : (
                                                <FormLabel>Nom</FormLabel>
                                            )}
                                        </div>
                                        <FormControl>
                                            <Input placeholder="Nom" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <div className="h-5">
                                            {fieldState.error ? (
                                                <FormMessage />
                                            ) : (
                                                <FormLabel>Prénom</FormLabel>
                                            )}
                                        </div>
                                        <FormControl>
                                            <Input placeholder="Prénom" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="number"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <div className="h-5">
                                            {fieldState.error ? (
                                                <FormMessage />
                                            ) : (
                                                <FormLabel>Matricule</FormLabel>
                                            )}
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Matricule"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <div className="h-5">
                                            {fieldState.error ? (
                                                <FormMessage />
                                            ) : (
                                                <FormLabel>Numéro de téléphone</FormLabel>
                                            )}
                                        </div>
                                        <FormControl>
                                            <Input placeholder="Numéro de téléphone" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {!isAdmin ? (
                                <ItemForm
                                    title="Métier"
                                    description={userToUpdate.rank?.job?.name ?? "Vide"}
                                />
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="jobId"
                                    render={({ field, fieldState }) => (
                                        <FormItem
                                            data-invalid={fieldState.invalid}
                                            className="gap-0"
                                        >
                                            <div className="h-5">
                                                {fieldState.error ? (
                                                    <FormMessage />
                                                ) : (
                                                    <FormLabel>Métier</FormLabel>
                                                )}
                                            </div>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        form.setValue("rankId", "");
                                                        onJobChange?.(value);
                                                    }}
                                                >
                                                    <SelectTrigger
                                                        aria-invalid={fieldState.invalid}
                                                        className={`${cn(
                                                            "min-w-[120px]",
                                                            fieldState.invalid &&
                                                                "border-destructive focus:ring-destructive"
                                                        )} w-full`}
                                                    >
                                                        <SelectValue placeholder="Choisir..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {jobs.map((job) => (
                                                            <SelectItem
                                                                key={job.value}
                                                                value={job.value}
                                                            >
                                                                {job.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}
                            {!isAdmin ? (
                                <ItemForm
                                    title="Grade"
                                    description={userToUpdate.rank?.name ?? "Vide"}
                                />
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="rankId"
                                    render={({ field, fieldState }) => (
                                        <FormItem
                                            data-invalid={fieldState.invalid}
                                            className="gap-0"
                                        >
                                            <div className="h-5">
                                                {fieldState.error ? (
                                                    <FormMessage />
                                                ) : (
                                                    <FormLabel>Grade</FormLabel>
                                                )}
                                            </div>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                    }}
                                                    disabled={
                                                        !form.watch("jobId") ||
                                                        form.watch("jobId") === "none"
                                                    }
                                                >
                                                    <SelectTrigger
                                                        aria-invalid={fieldState.invalid}
                                                        className={`${cn(
                                                            "min-w-[120px]",
                                                            fieldState.invalid &&
                                                                "border-destructive focus:ring-destructive"
                                                        )} w-full`}
                                                    >
                                                        <SelectValue placeholder="Choisir..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">Tous</SelectItem>
                                                        <SelectSeparator />
                                                        {ranks.map((rank) => (
                                                            <SelectItem
                                                                key={rank.value}
                                                                value={rank.value}
                                                            >
                                                                {rank.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </UserCard>
                    </TabsContent>
                    <ButtonGroupForm
                        onCancel={function (): void {
                            form.reset({
                                firstName: userToUpdate.firstName || "",
                                lastName: userToUpdate.lastName || "",
                                number: userToUpdate.number || undefined,
                                phoneNumber: userToUpdate.phoneNumber || "",
                                jobId: userToUpdate.rank?.job?.id
                                    ? String(userToUpdate.rank.job.id)
                                    : "none",
                                rankId: userToUpdate.rank?.id
                                    ? String(userToUpdate.rank.id)
                                    : "none",
                                roleId: userToUpdate.role.key
                                    ? String(userToUpdate.role.key)
                                    : "none",
                            });
                            form.clearErrors();
                            onCancel?.();
                        }}
                    />
                </Tabs>
            </form>
        </Form>
    );
}
