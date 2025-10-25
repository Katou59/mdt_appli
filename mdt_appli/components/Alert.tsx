"use client";

import { useAlert } from "@/lib/Contexts/alert-context";
import { useEffect } from "react";

type Props = {
    title?: string;
    descrition?: string;
    type?: "unauthorized" | "invalidParameter";
};

export default function Alert({
    title = "Erreur",
    descrition: description = "Une erreur est survenue",
    type,
}: Props) {
    const { setAlert } = useAlert();
    useEffect(() => {
        if (type) {
            switch (type) {
                case "unauthorized":
                    setAlert({ title: "Erreur", description: "Vous n'êtes pas authorisé" });
                    return;
                case "invalidParameter":
                    setAlert({ title: "Erreur", description: "Paramètre invalide" });
                    return;
                default:
                    setAlert({ title: "Erreur", description: "Une erreur est survenue" });
                    return;
            }
        }
        if (title || description) {
            setAlert({ title, description: description });
        }
    }, [type, title, description, setAlert]);

    return <></>;
}
