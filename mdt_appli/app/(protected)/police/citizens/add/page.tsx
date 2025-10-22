import React from "react";
import AddCitizenClient from "./page.client";

export const metadata = {
    title: "MDT - Ajout d'un citoyen",
    description: "Ajout d'un nouveau citoyen.",
};

export default function AddCitizen() {
    return <AddCitizenClient />;
}
