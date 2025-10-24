/**
 * Génère automatiquement deux fichiers d'énums à partir des tables "roles" et "statuses".
 * Utilise Drizzle pour lire les valeurs depuis la base.
 *
 * ⚙️ À lancer avec : npx tsx scripts/generateRoleEnum.ts
 */

import { bloodTypesTable, gendersTable, rolesTable, statusesTable } from "@/db/schema"; // adapte le chemin selon ton projet
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import fs from "fs";
import path from "path";
import { Client } from "pg";

config(); // charge le .env

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

// Liste des enums à générer
const enums = [
    { path: "types/enums/role-enum.ts", table: rolesTable, name: "role", enumName: "RoleType" },
    {
        path: "types/enums/gender-enum.ts",
        table: gendersTable,
        name: "gender",
        enumName: "GenderType",
    },
    {
        path: "types/enums/blood-type-enum.ts",
        table: bloodTypesTable,
        name: "bloodType",
        enumName: "BloodTypeType",
    },
    {
        path: "types/enums/status-enum.ts",
        table: statusesTable,
        name: "status",
        enumName: "StatusType",
    },
] as const;

async function main() {
    // ✅ S'assure que le client PG est connecté avant toute requête
    await client.connect();
    const db = drizzle(client);

    for (const e of enums) {
        const outputFile = path.resolve(e.path);

        console.log(`🔄 Lecture des données ${e.name} depuis la base...`);

        const values = await db.select().from(e.table);

        if (values.length === 0) {
            console.warn(`⚠️ Aucun ${e.name} trouvé dans la base !`);
            continue;
        }

        console.log(`📦 ${values.length} valeur(s) de ${e.name} trouvée(s) :`);
        values.forEach((r) => console.log(`- ${r.name} (${r.id})`));

        // Génération du contenu TypeScript
        const lines = values.map((r) => `  ${r.enumLabel} = ${r.id},`).join("\n");

        const content = `// ⚙️ Fichier généré automatiquement — ne pas modifier à la main\n// Dernière génération : ${new Date().toISOString()}\n\nexport enum ${
            e.enumName
        } {\n${lines}\n}\n`;

        // ✅ Crée le dossier cible si nécessaire
        fs.mkdirSync(path.dirname(outputFile), { recursive: true });

        // Écriture du fichier
        fs.writeFileSync(outputFile, content);
        console.log(`✅ Enum générée : ${outputFile}`);
    }

    console.log("🚀 Terminé !");
}

main()
    .catch((err) => {
        console.error("❌ Erreur :", err);
        process.exit(1);
    })
    .finally(async () => {
        await client.end();
    });
