import { FineType } from "../commons/fine";
import { JobType } from "../commons/job";
import { RankType } from "../commons/rank";
import { KeyValueType } from "./key-value";

export interface MetadataType {
    jobs: JobType[];
    ranks: RankType[];
    roles: KeyValueType<number, string>[];
    nationalities: KeyValueType<number, string>[];
    genders: KeyValueType<number, string>[];
    bloodTypes: KeyValueType<number, string>[];
    statuses: KeyValueType<number, string>[];
    fines: FineType[];
}
