import { JobType } from "../db/job";
import { RankType } from "../db/rank";
import { KeyValueType } from "./key-value";

export interface MetadataType {
    jobs: JobType[];
    ranks: RankType[];
    roles: KeyValueType<number, string>[];
    nationalities: KeyValueType<number, string>[];
    genders: KeyValueType<number, string>[];
    bloodTypes: KeyValueType<number, string>[];
    statuses: KeyValueType<number, string>[];
}
