import { KeyValue } from "../utils/keyValue";
import { UserType } from "./user";

export interface CitizenType {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    gender: KeyValue<number, string> | null;
    phoneNumber: string | null;
    licenseId: string | null;
    job: string | null;
    note: string | null;
    isWanted: boolean;
    status: KeyValue<number, string> | null;
    bloodType: KeyValue<number, string> | null;
    photoUrl: string | null;
    createdBy: UserType;
    createdAt: Date;
    updatedBy: UserType;
    updatedAt: Date;
    createdBy: UserType;
    address: string | null;
    city: string | null;
}
