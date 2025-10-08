import { UserType } from "./user";

export interface CitizenType {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    nationality: string;
    address: string;
    phoneNumber: string;
    licenseId: string;
    occupation: string;
    note: string;
    isWanted: string;
    status: string;
    bloodType: string;
    photoUrl: string;
    createdBy: UserType;
    createdAt: Date;
    updatedAt: string;
}
