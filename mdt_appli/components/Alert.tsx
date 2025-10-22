"use client";

import { useAlert } from "@/lib/Contexts/AlertContext";
import React, { useEffect } from "react";

type Props = {
    title?: string;
    descrition?: string;
    type?: "unauthorized";
};

export default function Alert({
    title = "Erreur",
    descrition = "Une erreur est survenue",
    type,
}: Props) {
    const { setAlert } = useAlert();
    useEffect(() => {
        if (type) {
            switch (type) {
                case "unauthorized":
                    setAlert({ title: "Erreur", description: "Vous n'êtes pas authorisé" });
                    return;
                default:
                    setAlert({ title: "Erreur", description: "Une erreur est survenue" });
                    return;
            }
        }
        if (title || descrition) {
            setAlert({ title, description: descrition });
        }
    }, [type, title, descrition, setAlert]);

    return <></>;
}
