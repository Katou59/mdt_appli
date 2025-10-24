export const config = {
    // Définition des routes protégées par le middleware
    matcher: ["/police/:path*", "/api/:path*"],
    // Forcer l'exécution en runtime Node.js
    runtime: "nodejs",
};

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import UserService from "./services/userService";

// Liste des routes API nécessitant des droits d'admin spécifiques
const apiAdmins = [
    { path: "/api/users", method: "POST" },
    { path: "/api/ranks", method: "PUT" },
    { path: "/api/ranks", method: "DELETE" },
];

export async function middleware(req: NextRequest) {
    // Autoriser les requêtes vers les endpoints d'authentification sans restriction
    if (req.nextUrl.pathname.startsWith("/api/auth/")) return NextResponse.next();

    // Récupération de la session utilisateur via authentification
    const session = await auth();
    if (!session?.user?.discordId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userService = await UserService.create(session.user.discordId);

    // Vérification des droits d'admin pour certaines routes API sensibles
    if (apiAdmins.some((x) => req.nextUrl.pathname.startsWith(x.path) && x.method === req.method)) {
        const user = await userService.get(session!.user.discordId!);

        // Si l'utilisateur n'est pas admin, renvoyer une erreur 401 Unauthorized
        if (!user?.isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    // Si l'utilisateur n'est pas authentifié, rediriger vers la page d'accueil
    if (!session?.user?.discordId) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Vérifier si l'utilisateur est désactivé dans la base de données
    const userDb = await userService.get(session.user.discordId);
    if (userDb?.isDisable) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Autoriser la requête si toutes les vérifications sont passées
    const response = NextResponse.next();
    return response;
}
