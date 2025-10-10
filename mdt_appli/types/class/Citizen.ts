import {
    bloodTypesTable,
    citizensTable,
    gendersTable,
    jobsTable,
    ranksTable,
    statusesTable,
    usersTable,
} from "@/db/schema";
import { CitizenType } from "../db/citizen";
import { KeyValueType } from "../utils/keyValue";
import User from "./User";
import IConverter from "../interfaces/IConverter";
import { StatusType } from "../enums/statusType";

export default class Citizen implements CitizenType, IConverter<CitizenType> {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    gender: KeyValueType<number, string> | null;
    phoneNumber: string | null;
    licenseId: string | null;
    job: string | null;
    note: string | null;
    isWanted: boolean;
    status: KeyValueType<number, string>| null;
    bloodType: KeyValueType<number, string> | null;
    photoUrl: string | null;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: User;
    fullName: string;
    address: string | null;
    city: string | null;

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
        this.address = citizen.address;
        this.city = citizen.city;
        this.createdBy = new User(citizen.createdBy);
        this.updatedBy = new User(citizen.updatedBy);
        this.fullName = `${this.firstName} ${this.lastName}`;
    }

    static getFromDb(
        citizenDb: typeof citizensTable.$inferSelect,
        genderDb: typeof gendersTable.$inferSelect | null,
        statusDb: typeof statusesTable.$inferSelect | null,
        bloodTypeDb: typeof bloodTypesTable.$inferSelect | null,
        createdByDb: typeof usersTable.$inferSelect,
        createdByRankDb: typeof ranksTable.$inferSelect,
        createdByJobDb: typeof jobsTable.$inferSelect,
        updatedByDb: typeof usersTable.$inferSelect,
        updatedByRankDb: typeof ranksTable.$inferSelect,
        updatedByJobDb: typeof jobsTable.$inferSelect
    ): Citizen {
        const createdBy = User.getFromDb(
            createdByDb,
            createdByRankDb,
            createdByJobDb
        )!.toUserType();
        const updatedBy = User.getFromDb(
            updatedByDb,
            updatedByRankDb,
            updatedByJobDb
        )!.toUserType();

        const citizenType: CitizenType = {
            id: citizenDb.id,
            firstName: citizenDb.firstName,
            lastName: citizenDb.lastName,
            birthDate: citizenDb.birthDate,
            gender: genderDb ? { key: genderDb.id, value: genderDb.name } : null,
            phoneNumber: citizenDb.phoneNumber,
            licenseId: citizenDb.licenseId!,
            job: citizenDb.job,
            note: citizenDb.note,
            isWanted: citizenDb.isWanted ?? false,
            status: statusDb ? { key: statusDb.id, value: statusDb.name } : null,
            bloodType: bloodTypeDb ? { key: bloodTypeDb.id, value: bloodTypeDb.type } : null,
            photoUrl: citizenDb.photoUrl,
            createdBy: createdBy,
            createdAt: new Date(citizenDb.createdAt),
            updatedAt: new Date(citizenDb.updatedAt),
            updatedBy: updatedBy,
            address: citizenDb.address,
            city: citizenDb.city,
        };

        return new Citizen(citizenType);
    }

    toType(): CitizenType {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            birthDate: this.birthDate,
            gender: this.gender,
            phoneNumber: this.phoneNumber,
            licenseId: this.licenseId,
            job: this.job,
            note: this.note,
            isWanted: this.isWanted,
            status: this.status,
            bloodType: this.bloodType,
            photoUrl: this.photoUrl,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            updatedBy: this.updatedBy,
            address: this.address,
            city: this.city,
        };
    }
}
