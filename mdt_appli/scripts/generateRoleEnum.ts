/**
 * Génère automatiquement un fichier RoleType.ts à partir de la table "roles"
 * Utilise Drizzle pour lire les rôles depuis la base.
 *
 * ⚙️ À lancer avec : npx tsx scripts/generateRoleEnum.ts
 */

import fs from "fs";
import path from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import { rolesTable } from "@/db/schema"; // adapte le chemin selon ton projet
import { config } from "dotenv";
import { Client } from "pg";

config(); // charge le .env

const outputFile = path.resolve("types/enums/RoleType.ts");

async function main() {
    console.log("🔄 Lecture des rôles depuis la base...");

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    const db = drizzle(client);

    const roles = await db.select().from(rolesTable);

    if (roles.length === 0) {
        console.warn("⚠️ Aucun rôle trouvé dans la base !");
        await client.end();
        return;
    }

    console.log(`📦 ${roles.length} rôles trouvés :`);
    roles.forEach((r) => console.log(`- ${r.name} (${r.id})`));

    // Génération du contenu TypeScript
    const lines = roles
        .map((r) => `    ${r.name.replace(/\s+/g, "_")} = ${r.id},`)
        .join("\n");

    const content = `// ⚙️ Fichier généré automatiquement — ne pas modifier à la main
// Dernière génération : ${new Date().toISOString()}

export enum RoleType {
${lines}
}
`;

    // Écriture du fichier
    fs.writeFileSync(outputFile, content);
    console.log(`✅ Enum générée : ${outputFile}`);

    await client.end();
    console.log("🚀 Terminé !");
}

main().catch((err) => {
    console.error("❌ Erreur :", err);
    process.exit(1);
});
