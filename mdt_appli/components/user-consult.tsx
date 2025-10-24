"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserType } from "@/types/db/user";
import dayjs from "dayjs";

import { useUser } from "@/lib/Contexts/UserContext";
import Link from "next/link";
import { ItemForm } from "./item-form";
import { Button } from "./ui/button";
import UserCard from "./user-card";

export default function UserConsult({
    userToUpdate,
    updateHref,
    onlyRp,
}: {
    userToUpdate: UserType;
    updateHref?: string;
    onlyRp?: boolean;
}) {
    const { user } = useUser();
    console.log(onlyRp);

    return (
        <div className="flex w-full max-w-lg flex-col gap-2">
            <Tabs defaultValue={onlyRp ? "rp" : "hrp"}>
                {!onlyRp && (
                    <TabsList>
                        <TabsTrigger value="hrp">Informations HRP</TabsTrigger>
                        <TabsTrigger value="rp">Informations RP</TabsTrigger>
                    </TabsList>
                )}
                <TabsContent value="hrp">
                    <UserCard
                        title="Informations HRP"
                        description="Informations relatives à l'utilisateur.">
                        <ItemForm title="Id Discord" description={userToUpdate.id} />
                        <ItemForm title="Nom Discord" description={userToUpdate.name ?? "Vide"} />
                        <ItemForm
                            title="Adresse e-mail"
                            description={userToUpdate.email ?? "Vide"}
                        />
                        <ItemForm title="Rôle" description={userToUpdate.role.value ?? "Vide"} />
                        <ItemForm
                            title="Statut"
                            description={userToUpdate.isDisable ? "Désactivé" : "Activé"}
                        />
                        <ItemForm
                            title="Date de création"
                            description={dayjs(userToUpdate.createdAt).format(
                                "DD/MM/YYYY HH:mm:ss"
                            )}
                        />
                        <ItemForm
                            title="Première connexion"
                            description={
                                userToUpdate.firstLogin
                                    ? dayjs(userToUpdate.firstLogin).format("DD/MM/YYYY HH:mm:ss")
                                    : "Jamais connecté"
                            }
                        />
                        <ItemForm
                            title="Dernière connexion"
                            description={
                                userToUpdate.lastLogin
                                    ? dayjs(userToUpdate.lastLogin).format("DD/MM/YYYY HH:mm:ss")
                                    : "Jamais connecté"
                            }
                        />
                    </UserCard>
                </TabsContent>
                <TabsContent value="rp">
                    <UserCard
                        title="Informations RP"
                        description="Informations relatives au personnage.">
                        <ItemForm title="Nom" description={userToUpdate.lastName ?? "Vide"} />
                        <ItemForm title="Prénom" description={userToUpdate.firstName ?? "Vide"} />
                        <ItemForm
                            title="Matricule"
                            description={userToUpdate.number ? String(userToUpdate.number) : "Vide"}
                        />
                        <ItemForm
                            title="Numéro de téléphone"
                            description={userToUpdate.phoneNumber ?? "Vide"}
                        />
                        <ItemForm
                            title="Métier"
                            description={userToUpdate.rank?.job?.name ?? "Vide"}
                        />
                        <ItemForm title="Grade" description={userToUpdate.rank?.name ?? "Vide"} />
                    </UserCard>
                </TabsContent>
            </Tabs>
            {user?.isAdmin && (
                <div className="flex items-center justify-center">
                    <Button className="w-25" asChild>
                        <Link
                            href={
                                updateHref ? updateHref : `/police/users/${userToUpdate.id}/update`
                            }>
                            Modifier
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
