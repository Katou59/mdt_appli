import { UserType } from "./user";

export interface FineType {
    id: string;
    type: ["infraction", "misdemeanor", "felony", "other"];
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
