import { JobType } from "@/types/commons/job";

export default class Job {
    id: number | null;
    name: string | null;

    constructor(job: JobType) {
        this.id = job.id;
        this.name = job.name;
    }

    toJobType(): JobType {
        return {
            id: this.id,
            name: this.name,
        } as JobType;
    }
}
