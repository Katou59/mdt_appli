import { KeyValueType } from "../utils/keyValue";
import { UserType } from "./user";

export interface CitizenType {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    gender: KeyValueType<number, string> | null;
    phoneNumber: string | null;
    job: string | null;
    description: string | null;
    isWanted: boolean;
    status: KeyValueType<number, string> | null;
    bloodType: KeyValueType<number, string> | null;
    photoUrl: string | null;
    createdBy: UserType;
    createdAt: Date;
    updatedBy: UserType;
    updatedAt: Date;
    createdBy: UserType;
    address: string | null;
    city: string | null;
}
