import {JobType} from "@/types/db/job";

export type RankType = {
    id: number | null;
    name: string | null;
    Job: JobType | null
}