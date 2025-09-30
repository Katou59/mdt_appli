import {RankType} from "@/types/db/rank";
import {RoleType} from "@/types/db/enums/roleType";

export type UserType = {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date;
    firstLogin: Date | null,
    lastLogin: Date | null,
    number: number | null;
    firstName: string | null;
    lastName: string | null;
    rank: RankType | null;
    phoneNumber: string | null;
    isDisable: boolean;
    role: RoleType;
}

export type UserToUpdateType = {
    id: string;
    number?: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    rankId?: number;
    jobId?: number;
    lastLogin?: Date,
    email?: string,
    name?: string,
    firstLogin?: Date
}