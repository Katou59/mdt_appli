import { RankType } from "@/types/commons/rank";
import Job from "./Job";

export default class Rank {
    id: number | null;
    name: string | null;
    job: Job | null;
    order: number | null;
    userCount: number | undefined;

    constructor(rank?: RankType) {
        if (!rank) {
            this.id = null;
            this.name = null;
            this.job = null;
            this.order = null;
            this.userCount = undefined;

            return;
        }

        this.id = rank?.id;
        this.name = rank?.name;
        this.job = rank?.job ? new Job(rank.job) : null;
        this.order = rank.order;
        this.userCount = rank.userCount;
    }

    toRankType(): RankType {
        return {
            id: this.id,
            name: this.name,
            job: this.job?.toJobType() ?? null,
            order: this.order,
            userCount: this.userCount,
        } as RankType;
    }
}
