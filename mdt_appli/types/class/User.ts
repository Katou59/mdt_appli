import { UserToUpdateType, UserType } from "@/types/db/user";
import { RoleType } from "@/types/enums/roleType";
import Rank from "@/types/class/Rank";
import { jobsTable, ranksTable, usersTable } from "@/db/schema";
import { JobType } from "../db/job";
import { RankType } from "../db/rank";

export default class User {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date;
    firstLogin: Date | null;
    lastLogin: Date | null;
    number: number | null;
    firstName: string | null;
    lastName: string | null;
    rank: Rank | null;
    phoneNumber: string | null;
    isDisable: boolean;
    role: RoleType;
    isAdmin: boolean;
    fullName: string | null;

    constructor(data: UserType) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.createdAt = new Date(data.createdAt);
        this.firstLogin = data.firstLogin ? new Date(data.firstLogin) : null;
        this.lastLogin = data.lastLogin ? new Date(data.lastLogin) : null;
        this.number = data.number;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.rank = data.rank ? new Rank(data.rank) : null;
        this.phoneNumber = data.phoneNumber;
        this.isDisable = data.isDisable;
        this.role = data.role;

        this.isAdmin = data.role === RoleType.Admin || data.role === RoleType.SuperAdmin;
        this.fullName =
            this.firstName && this.lastName ? `${this.firstName} ${this.lastName}` : null;
    }

    update(user: UserToUpdateType, currentUserIsAdmin = false, currentUserIsSuperAdmin = false) {
        if (user.number !== undefined) {
            this.number = user.number;
        }
        if (user.firstName !== undefined) {
            this.firstName = user.firstName;
        }
        if (user.lastName !== undefined) {
            this.lastName = user.lastName;
        }
        if (user.phoneNumber !== undefined) {
            this.phoneNumber = user.phoneNumber;
        }
        if (user.email !== undefined) {
            this.email = user.email;
        }
        if (user.name !== undefined) {
            this.name = user.name;
        }
        if (user.lastLogin !== undefined) {
            this.lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
        }
        if (user.firstLogin !== undefined) {
            this.firstLogin = user.firstLogin ? new Date(user.firstLogin) : null;
        }

        if (!currentUserIsAdmin) return;

        if (user.rank !== undefined) {
            this.rank = new Rank(user.rank);
        }

        if (!currentUserIsSuperAdmin) return;

        if (user.role) {
            this.role = user.role;
        }
    }

    toUserType(): UserType {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            createdAt: this.createdAt,
            firstLogin: this.firstLogin,
            lastLogin: this.lastLogin,
            number: this.number,
            firstName: this.firstName,
            lastName: this.lastName,
            rank: this.rank?.toRankType() ?? null,
            phoneNumber: this.phoneNumber,
            isDisable: this.isDisable,
            role: this.role,
        };
    }

    static getFromDb(
        userDb: typeof usersTable.$inferSelect | null,
        rankDb: typeof ranksTable.$inferSelect | null,
        jobDb: typeof jobsTable.$inferSelect | null
    ): User | null {
        if (!userDb) return null;

        let rankType: RankType | null = null;
        let jobType: JobType | null = null;
        if (jobDb) {
            jobType = {
                id: jobDb.id,
                name: jobDb.name,
            };
        }
        if (rankDb) {
            rankType = {
                id: rankDb.id,
                name: rankDb.name,
                order: rankDb.order,
                job: jobType,
                userCount: undefined,
            };
        }

        const userType: UserType = {
            id: userDb.id,
            name: userDb.name,
            email: userDb.email,
            createdAt: new Date(userDb.createdAt),
            firstLogin: userDb.firstLogin ? new Date(userDb.firstLogin) : null,
            lastLogin: userDb.lastLogin ? new Date(userDb.lastLogin) : null,
            number: userDb.number,
            firstName: userDb.firstName,
            lastName: userDb.lastName,
            rank: rankType,
            phoneNumber: userDb.phoneNumber,
            isDisable: userDb.isDisable ?? false,
            role: userDb.role,
        };

        return new User(userType);
    }
}
