import {
    citizenFinesTable,
    finesTable,
    jobsTable,
    ranksTable,
    rolesTable,
    usersTable,
} from "@/db/schema";
import { CitizenFineType } from "../commons/citizen-fine";
import IConverter from "../interfaces/IConverter";
import Fine from "./Fine";
import User from "./User";

export default class CitizenFine implements IConverter<CitizenFineType>, CitizenFineType {
    fine: Fine;
    amount: number;
    jailTime: number;
    createdAt: Date;
    createdBy: User;

    constructor(citizenFine: CitizenFineType) {
        this.fine = new Fine(citizenFine.fine);
        this.amount = citizenFine.amount;
        this.createdAt = citizenFine.createdAt;
        this.createdBy = new User(citizenFine.createdBy);
        this.jailTime = citizenFine.jailTime;
    }

    public toType(): CitizenFineType {
        return {
            amount: this.amount,
            createdAt: this.createdAt,
            createdBy: this.createdBy.toType(),
            fine: this.fine.toType(),
            jailTime: this.jailTime,
        };
    }

    public static getFomDb(
        citizenFineDb: typeof citizenFinesTable.$inferSelect,
        createdByDb: typeof usersTable.$inferSelect,
        createdByJobDb: typeof jobsTable.$inferSelect,
        createdByRankDb: typeof ranksTable.$inferSelect,
        createdByRoleDb: typeof rolesTable.$inferSelect,
        fineDb: typeof finesTable.$inferSelect,
        fineCreatedByDb: typeof usersTable.$inferSelect,
        fineCreatedByJobDb: typeof jobsTable.$inferSelect,
        fineCreatedByRankDb: typeof ranksTable.$inferSelect,
        fineCreatedByRoleDb: typeof rolesTable.$inferSelect
    ) {
        const fine = Fine.getFromDb(
            fineDb,
            fineCreatedByDb,
            fineCreatedByJobDb,
            fineCreatedByRankDb,
            fineCreatedByRoleDb
        );
        const createdBy = User.getFromDb(
            createdByDb,
            createdByRankDb,
            createdByJobDb,
            createdByRoleDb
        );

        return new CitizenFine({
            amount: citizenFineDb.amount ?? 0,
            createdAt: citizenFineDb.createdAt,
            createdBy: createdBy!,
            fine: fine,
            jailTime: citizenFineDb.jailTime ?? 0,
        });
    }
}
