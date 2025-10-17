import { JobType } from "../db/job";
import { RankType } from "../db/rank";
import { KeyValueType } from "./keyValue";

export interface MetadataType {
    jobs: JobType[];
    ranks: RankType[];
    roles: KeyValueType<number, string>[];
}
