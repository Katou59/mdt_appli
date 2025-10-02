import {JobType} from "@/types/db/job";

export interface RankType {
    id: number | null;
    name: string | null;
    job: JobType | null;
	order: number | null;
}