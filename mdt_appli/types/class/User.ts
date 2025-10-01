import {UserToUpdateType, UserType} from "@/types/db/user";
import { RankType } from "../db/rank";
import {RoleType} from "@/types/enums/roleType";

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
    rank: RankType | null;
    phoneNumber: string | null;
    isDisable: boolean;
    role: RoleType;
    isAdmin: boolean;

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
        this.rank = data.rank;
        this.phoneNumber = data.phoneNumber;
        this.isDisable = data.isDisable;
        this.role = data.role;
        this.isAdmin = data.role === RoleType.Admin || data.role === RoleType.SuperAdmin;
    }

    update(user: UserToUpdateType){
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
    }
    
    toUserType(): UserType{
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
            rank: this.rank,
            phoneNumber: this.phoneNumber,
            isDisable: this.isDisable,
            role: this.role,
        };
    }
}