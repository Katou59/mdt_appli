import { FineType as FineTypeEnum } from "../enums/fine-enum";
import { UserType } from "./user";

export interface FineType {
    id: string;
    type: FineTypeEnum;
    label: string;
    createdAt: Date;
    createdBy: UserType;
    amount: number;
    minimumAmount: number;
    maximumAmount: number;
    jailTime: number;
    minimumJailTime: number;
    maximumJailTime: number;
}
