import { FineType } from "./fine";
import { UserType } from "./user";

export interface CitizenFineType {
    fine: FineType;
    amount: number;
    jailTime: number;
    createdAt: Date;
    createdBy: UserType;
}
