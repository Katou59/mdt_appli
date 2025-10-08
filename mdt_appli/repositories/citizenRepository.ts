import UserId from "@/app/(protected)/police/users/[id]/page";
import {
    bloodTypesTable,
    citizensTable,
    gendersTable,
    jobsTable,
    ranksTable,
    statusesTable,
    usersTable,
} from "@/db/schema";
import Citizen from "@/types/class/Citizen";
import User from "@/types/class/User";
import { RankType } from "@/types/db/rank";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_URL!);

export default class CitizenRepository {
    static async GetList(): Promise<Citizen[]> {
        const dbCitizens = await db
            .select()
            .from(citizensTable)
            .leftJoin(bloodTypesTable, eq(bloodTypesTable.id, citizensTable.bloodTypeId))
            .leftJoin(statusesTable, eq(statusesTable.id, citizensTable.statusId))
            .leftJoin(gendersTable, eq(gendersTable.id, citizensTable.genderId))
            .leftJoin(usersTable, eq(usersTable.id, citizensTable.createdBy))
            .leftJoin(jobsTable, eq(jobsTable.id, usersTable.jobId))
            .leftJoin(ranksTable, eq(ranksTable.id, usersTable.rankId));

        const citizens = dbCitizens.map((dbCitizen) => {
            return Citizen.getFromDb(
                dbCitizen.citizens,
                dbCitizen.genders,
                dbCitizen.statuses,
                dbCitizen.blood_types,
                dbCitizen.users,
                dbCitizen.ranks,
                dbCitizen.jobs
            );
        });

        return citizens.filter((x) => x !== null);
    }
}
