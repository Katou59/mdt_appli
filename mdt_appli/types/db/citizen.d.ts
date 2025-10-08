import { KeyValue } from "../utils/keyValue";
import { UserType } from "./user";

export interface CitizenType {
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
    createdBy: UserType;
    createdAt: Date;
    updatedAt: Date;
    createdBy: UserType;
}
