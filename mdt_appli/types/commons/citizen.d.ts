import { KeyValueType } from "../utils/key-value";
import { CitizenFineType } from "./citizen-fine";
import { UserType } from "./user";

export interface CitizenType {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    birthPlace: string | null;
    gender: KeyValueType<number, string> | null;
    phoneNumber: string | null;
    job: string | null;
    description: string | null;
    isWanted: boolean;
    status: KeyValueType<number, string> | null;
    bloodType: KeyValueType<number, string> | null;
    photoUrl: string | null;
    createdAt: Date;
    updatedBy: UserType;
    updatedAt: Date;
    createdBy: UserType;
    address: string | null;
    city: string | null;
    eyeColor: string | null;
    hairColor: string | null;
    hasTattoo: boolean | null;
    origin: string | null;
    height: number | null;
    weight: number | null;
    nationality: KeyValueType<number, string> | null;
    citizenFines?: CitizenFineType[];
}

export interface CitizenToCreateType {
    firstName: string;
    lastName: string;
    birthDate: string | null;
    birthPlace: string | null;
    genderId: number | null;
    phoneNumber: string | null;
    job: string | null;
    description: string | null;
    isWanted: boolean;
    statusId: number | null;
    bloodTypeId: number | null;
    photoUrl: string | null;
    address: string | null;
    city: string | null;
    eyeColor: string | null;
    hairColor: string | null;
    hasTattoo: boolean;
    originId: number | null;
    height: number | null;
    weight: number | null;
    nationalityId: number | null;
}

export interface CitizenToUpdateType extends CitizenToCreateType {
    id: string;
}
