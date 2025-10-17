import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserType } from "@/types/db/user";
import dayjs from "dayjs";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Item, ItemContent, ItemDescription, ItemTitle } from "./ui/item";

export default function UserConsult({ userToUpdate }: { userToUpdate: UserType }) {
    return (
        <div className="flex w-full max-w-lg flex-col gap-6">
            <Tabs defaultValue="hrp">
                <TabsList>
                    <TabsTrigger value="hrp">Informations HRP</TabsTrigger>
                    <TabsTrigger value="rp">Informations RP</TabsTrigger>
                </TabsList>
                <TabsContent value="hrp">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations HRP</CardTitle>
                            <CardDescription>
                                Informations relatives à la gestion du compte utilisateur.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid">
                            <ItemCustom title="Id Discord" description={userToUpdate.id} />
                            <ItemCustom
                                title="Nom Discord"
                                description={userToUpdate.name ?? "Vide"}
                            />
                            <ItemCustom
                                title="Adresse e-mail"
                                description={userToUpdate.email ?? "Vide"}
                            />
                            <ItemCustom
                                title="Rôle"
                                description={userToUpdate.role.value ?? "Vide"}
                            />
                            <ItemCustom
                                title="Statut"
                                description={userToUpdate.isDisable ? "Actif" : "Inactif"}
                            />
                            <ItemCustom
                                title="Date de création"
                                description={dayjs(userToUpdate.createdAt).format(
                                    "DD/MM/YYYY HH:mm:ss"
                                )}
                            />
                            <ItemCustom
                                title="Première connexion"
                                description={dayjs(userToUpdate.firstLogin).format(
                                    "DD/MM/YYYY HH:mm:ss"
                                )}
                            />
                            <ItemCustom
                                title="Dernière connexion"
                                description={
                                    userToUpdate.lastLogin
                                        ? dayjs(userToUpdate.lastLogin).format(
                                              "DD/MM/YYYY HH:mm:ss"
                                          )
                                        : "Jamais connecté"
                                }
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="rp">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations RP</CardTitle>
                            <CardDescription>
                                Informations relatives au personnage RP de l&apos;utilisateur.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid">
                            <ItemCustom
                                title="Nom du personnage"
                                description={userToUpdate.lastName ?? "Vide"}
                            />
                            <ItemCustom
                                title="Prénom du personnage"
                                description={userToUpdate.firstName ?? "Vide"}
                            />
                            <ItemCustom
                                title="Matricule"
                                description={
                                    userToUpdate.number ? String(userToUpdate.number) : "Vide"
                                }
                            />
                            <ItemCustom
                                title="Numéro de téléphone"
                                description={userToUpdate.phoneNumber ?? "Vide"}
                            />
                            <ItemCustom
                                title="Métier"
                                description={userToUpdate.rank?.job?.name ?? "Vide"}
                            />
                            <ItemCustom
                                title="Grade"
                                description={userToUpdate.rank?.name ?? "Vide"}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ItemCustom({ title, description }: { title: string; description: string }) {
    return (
        <Item className="py-3">
            <ItemContent>
                <ItemTitle>{title}</ItemTitle>
                <ItemDescription>{description}</ItemDescription>
            </ItemContent>
        </Item>
    );
}
