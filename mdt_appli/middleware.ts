export const config = {
	// Définition des routes protégées par le middleware
	matcher: ["/police/:path*", "/api/:path*"], 
	// Forcer l'exécution en runtime Node.js
	runtime: "nodejs",
};

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/repositories/userRepository";

// Liste des routes API nécessitant des droits d'admin spécifiques
const apiAdmins = [
	{ path: "/api/users", method: "GET" },
	{ path: "/api/users", method: "POST" },
	{ path: "/api/ranks", method: "PUT" },
	{ path: "/api/ranks", method: "DELETE" },
];

export async function middleware(req: NextRequest) {
	// Mesure du temps d'exécution pour les routes commençant par /api/
	const isApiRoute = req.nextUrl.pathname.startsWith("/api/");
	let startTime: number | undefined;
	if (isApiRoute) {
		startTime = Date.now();
	}

	// Récupération de la session utilisateur via authentification
	const session = await auth();

	// Autoriser les requêtes vers les endpoints d'authentification sans restriction
	if (req.nextUrl.pathname.startsWith("/api/auth/")) return NextResponse.next();

	// Vérification des droits d'admin pour certaines routes API sensibles
	if (apiAdmins.some((x) => req.nextUrl.pathname.startsWith(x.path) && x.method === req.method)) {
		const user = await UserRepository.get(session!.user.discordId!);

		// Si l'utilisateur n'est pas admin, renvoyer une erreur 401 Unauthorized
		if (!user?.isAdmin) {
			if (isApiRoute && startTime !== undefined) {
				logApiTimer(req.method, req.nextUrl.pathname, Date.now() - startTime);
			}
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
	}

	// Si l'utilisateur n'est pas authentifié, rediriger vers la page d'accueil
	if (!session?.user?.discordId) {
		if (isApiRoute && startTime !== undefined) {
			logApiTimer(req.method, req.nextUrl.pathname, Date.now() - startTime);
		}
		return NextResponse.redirect(new URL("/", req.url));
	}

	// Vérifier si l'utilisateur est désactivé dans la base de données
	const userDb = await UserRepository.get(session.user.discordId);
	if (userDb?.isDisable) {
		// Rediriger les utilisateurs désactivés vers la page d'accueil
		if (isApiRoute && startTime !== undefined) {
			logApiTimer(req.method, req.nextUrl.pathname, Date.now() - startTime);
		}
		return NextResponse.redirect(new URL("/", req.url));
	}

	// Autoriser la requête si toutes les vérifications sont passées
	const response = NextResponse.next();
	if (isApiRoute && startTime !== undefined) {
		logApiTimer(req.method, req.nextUrl.pathname, Date.now() - startTime);
	}
	return response;
}

function logApiTimer(method: string, path: string, ms: number) {
	// Coloration : vert si <200ms, jaune si <1000ms, rouge sinon
	let color: string;
	if (ms < 200) color = "\x1b[32m";      // vert
	else if (ms < 1000) color = "\x1b[33m"; // jaune
	else color = "\x1b[31m";                // rouge
	const reset = "\x1b[0m";
	console.log(
		`${color}[API TIMER] ${method} ${path} - ${ms}ms${reset}`
	);
}
