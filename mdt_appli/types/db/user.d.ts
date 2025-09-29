import {RankType} from "@/types/db/rank";

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
    rank: RankType | null
}

export type UserToUpdateType = {
    id: string;
    number: number | null;
    firstName: string | null;
    lastName: string | null;
    rankId: number | null;
    jobId: number | null;
}