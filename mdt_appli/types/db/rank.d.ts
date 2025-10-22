import { JobType } from "@/types/db/job";

export interface RankType {
    id: number | null;
    name: string | null;
    job: JobType | null;
    order: number | null;
    userCount: number | undefined;
}
export interface RankToUpdate {
    id?: number;
    name: string;
    jobId: string;
    order: number;
}
