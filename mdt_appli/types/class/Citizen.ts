import { bloodTypesTable, citizensTable, gendersTable, jobsTable, ranksTable, statusesTable, usersTable } from "@/db/schema";
import { CitizenType } from "../db/citizen";
import { UserType } from "../db/user";
import { KeyValue } from "../utils/keyValue";
import User from "./User";

export default class Citizen {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: KeyValue<number, string>;
    phoneNumber: string;
    licenseId: string;
    job: string;
    note: string;
    isWanted: boolean;
    status: KeyValue<number, string>;
    bloodType: KeyValue<number, string>;
    photoUrl: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;

    constructor(citizen: CitizenType) {
        this.id = citizen.id;
        this.firstName = citizen.firstName;
        this.lastName = citizen.lastName;
        this.birthDate = citizen.birthDate;
        this.gender = citizen.gender;
        this.phoneNumber = citizen.phoneNumber;
        this.licenseId = citizen.licenseId;
        this.job = citizen.job;
        this.note = citizen.note;
        this.isWanted = citizen.isWanted;
        this.status = citizen.status;
        this.bloodType = citizen.bloodType;
        this.photoUrl = citizen.photoUrl;
        this.createdAt = citizen.createdAt;
        this.updatedAt = citizen.updatedAt;
        this.createdBy = new User(citizen.createdBy);
    }

    static getFromDb(
        citizenDb: typeof citizensTable.$inferSelect | null,
        genderDb: typeof gendersTable.$inferSelect | null,
        statusDb: typeof statusesTable.$inferSelect | null,
        bloodTypeDb: typeof bloodTypesTable.$inferSelect | null,
        userDb: typeof usersTable.$inferSelect | null,
        rankDb: typeof ranksTable.$inferSelect | null,
        jobDb: typeof jobsTable.$inferSelect | null
    ): Citizen | null {
        if(!citizenDb) return null;

        const createdBy = User.getFromDb(userDb, rankDb, jobDb)!.toUserType();

        const citizenType: CitizenType = {
            id: citizenDb.id,
            firstName: citizenDb.firstName,
            lastName: citizenDb.lastName,
            birthDate: citizenDb.birthDate,
            gender: {key: genderDb!.id, value: genderDb!.name},
            phoneNumber: citizenDb.phoneNumber!,
            licenseId: citizenDb.licenseId!,
            job: citizenDb.job!,
            note: citizenDb.note!,
            isWanted: citizenDb.isWanted ?? false,
            status: {key: statusDb!.id, value: statusDb!.name},
            bloodType: {key: bloodTypeDb!.id, value: bloodTypeDb!.type},
            photoUrl: citizenDb.photoUrl!,
            createdBy: createdBy!,
            createdAt: new Date(citizenDb.createdAt),
            updatedAt: new Date(citizenDb.updatedAt),
        };

        return new Citizen(citizenType);
    }
}
