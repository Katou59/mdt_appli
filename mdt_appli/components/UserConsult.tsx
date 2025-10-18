import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserType } from "@/types/db/user";
import dayjs from "dayjs";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Item, ItemContent, ItemDescription, ItemTitle } from "./ui/item";
import { TableFooter } from "./ui/table";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ItemForm } from "./ItemForm";
import UserCard from "./UserCard";

export default function UserConsult({ userToUpdate }: { userToUpdate: UserType }) {
    return (
        <div className="flex w-full max-w-lg flex-col gap-2">
            <Tabs defaultValue="hrp">
                <TabsList>
                    <TabsTrigger value="hrp">Informations HRP</TabsTrigger>
                    <TabsTrigger value="rp">Informations RP</TabsTrigger>
                </TabsList>
                <TabsContent value="hrp">
                    <UserCard
                        title="Informations HRP"
                        description="Informations relatives à l'utilisateur."
                    >
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
                            description={dayjs(userToUpdate.firstLogin).format(
                                "DD/MM/YYYY HH:mm:ss"
                            )}
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
                        description="Informations relatives au personnage."
                    >
                        <ItemForm
                            title="Nom du personnage"
                            description={userToUpdate.lastName ?? "Vide"}
                        />
                        <ItemForm
                            title="Prénom du personnage"
                            description={userToUpdate.firstName ?? "Vide"}
                        />
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
            <div className="flex items-center justify-center">
                <Button className="w-25" asChild>
                    <Link href={`/police/users/${userToUpdate.id}/update`}>Modifier</Link>
                </Button>
            </div>
        </div>
    );
}
