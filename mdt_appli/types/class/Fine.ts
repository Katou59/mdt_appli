import { finesTable, jobsTable, ranksTable, rolesTable, usersTable } from "@/db/schema";
import { FineType } from "../db/fine";
import IConverter from "../interfaces/IConverter";
import User from "./User";

export default class Fine implements IConverter<FineType>, FineType {
    id: string;
    type: ["infraction", "misdemeanor", "felony", "other"];
    label: string;
    createdAt: Date;
    createdBy: User;
    amount: number;
    minimumAmount: number;
    maximumAmount: number;
    jailTime: number;
    minimumJailTime: number;
    maximumJailTime: number;

    constructor(fine: FineType) {
        this.id = fine.id;
        this.type = fine.type;
        this.label = fine.label;
        this.createdAt = fine.createdAt;
        this.createdBy = new User(fine.createdBy);
        this.amount = fine.amount;
        this.minimumAmount = fine.minimumAmount;
        this.maximumAmount = fine.maximumAmount;
        this.jailTime = fine.jailTime;
        this.minimumJailTime = fine.minimumJailTime;
        this.maximumJailTime = fine.maximumJailTime;
    }

    public toType(): FineType {
        return {
            id: this.id,
            type: this.type,
            label: this.label,
            createdAt: this.createdAt,
            createdBy: this.createdBy.toType(),
            amount: this.amount,
            minimumAmount: this.minimumAmount,
            maximumAmount: this.maximumAmount,
            jailTime: this.jailTime,
            minimumJailTime: this.minimumJailTime,
            maximumJailTime: this.maximumJailTime,
        };
    }

    public static getFromDb(
        fineDb: typeof finesTable.$inferSelect,
        createdByDb: typeof usersTable.$inferSelect,
        createdByJobDb: typeof jobsTable.$inferSelect,
        createdByRankDb: typeof ranksTable.$inferSelect,
        createdByRoleDb: typeof rolesTable.$inferSelect
    ): Fine {
        const createdBy = User.getFromDb(
            createdByDb,
            createdByRankDb,
            createdByJobDb,
            createdByRoleDb
        );
        return new Fine({
            amount: fineDb.amount,
            createdAt: fineDb.createdAt,
            id: fineDb.id,
            jailTime: fineDb.jailTime,
            label: fineDb.label,
            maximumAmount: fineDb.maximumAmount,
            maximumJailTime: fineDb.maximumJailTime,
            minimumAmount: fineDb.minimumAmount,
            minimumJailTime: fineDb.minimumJailTime,
            type: fineDb.type as unknown as ["infraction", "misdemeanor", "felony", "other"],
            createdBy: createdBy!,
        });
    }
}
