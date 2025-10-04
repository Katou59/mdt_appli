import {RankType} from "@/types/db/rank";
import {RoleType} from "@/types/db/enums/roleType";

export interface UserType {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date | string;
    firstLogin: string | Date | null,
    lastLogin: string | Date | null,
    number: number | null;
    firstName: string | null;
    lastName: string | null;
    rank: RankType | null;
    phoneNumber: string | null;
    isDisable: boolean;
    role: RoleType;
}

export interface UserToUpdateType {
    id: string;
    number?: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    rank?: RankType;
    lastLogin?: Date | string,
    email?: string,
    name?: string,
    firstLogin?: Date | string
}

export interface UserToCreateType {
	id: string;
	jobId: number | null;
	rankId : number | null;
}