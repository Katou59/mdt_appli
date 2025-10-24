import HistoryRepository from "@/repositories/history-repository";
import { UserRepository } from "@/repositories/user-repository";
import User from "@/types/class/User";
import { UserToCreateType, UserToUpdateType } from "@/types/db/user";
import { HttpStatus } from "@/types/enums/http-status-enum";
import CustomError from "@/types/errors/CustomError";
import RankService from "./ranks-service";

type FilterType = {
    searchTerm?: string;
    isDisable?: boolean;
    jobId?: number;
    rankId?: number;
    roleId?: number;
};

export default class UserService {
    public readonly currentUser: User;

    constructor(currentUser: User) {
        this.currentUser = currentUser;
    }

    public static async create(currenUserId: string) {
        const user = await UserRepository.get(currenUserId);
        if (!user) throw new CustomError("Invalid user", HttpStatus.NOT_FOUND);

        return new UserService(user);
    }

    public async getList(page: number, itemPerPage: number, filter?: FilterType) {
        const pager = await UserRepository.getList({
            itemPerPage: itemPerPage,
            page: page,
            filter: filter,
        });

        if (!this.currentUser.isAdmin) {
            pager.items?.forEach((user) => {
                user.email = null;
            });
        }

        return pager;
    }

    public async add(userToAdd: UserToCreateType): Promise<User> {
        const existingUser = await UserRepository.get(userToAdd.id);
        if (existingUser) {
            throw new CustomError("Conflict", HttpStatus.CONFLICT);
        }

        const userCreatedId = await UserRepository.add(userToAdd);

        const userCreated = await this.get(userCreatedId);
        if (!userCreated) {
            throw new CustomError(
                "Error while creating the user.",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        HistoryRepository.Add({
            action: "create",
            entityId: userCreated?.id ?? null,
            entityType: "user",
            newData: userCreated ?? null,
            oldData: null,
            userId: this.currentUser.id,
        });

        return userCreated;
    }

    public async get(id: string): Promise<User> {
        const user = await UserRepository.get(id);

        if (!user?.id) {
            throw new CustomError("Not found", HttpStatus.NOT_FOUND);
        }

        if (!this.currentUser.isAdmin && this.currentUser.id !== user.id) {
            user.email = null;
        }

        return user;
    }

    public async update(userToUpdateType: UserToUpdateType): Promise<User> {
        const userToUpdate = await this.get(userToUpdateType.id);
        if (!userToUpdate?.id) {
            throw new CustomError("Bad Request", HttpStatus.NOT_FOUND);
        }

        userToUpdate.update(userToUpdateType);

        if (this.currentUser?.isAdmin) {
            if (!userToUpdateType.rankId) {
                throw new CustomError("Bad request", HttpStatus.BAD_REQUEST);
            }

            const rankService = new RankService(this.currentUser);
            const rank = await rankService.get(userToUpdateType.rankId);
            if (!rank) {
                throw new CustomError("Rank not found", HttpStatus.NOT_FOUND);
            }
            userToUpdate.rank = rank;
            userToUpdate.isDisable = userToUpdateType.isDisable ?? userToUpdate.isDisable;
            userToUpdate.role = {
                key: userToUpdateType.roleId!,
                value: "",
            };
        }

        const isSelf = this.currentUser.id === userToUpdate.id;

        if (this.currentUser.isDisable || (!this.currentUser.isAdmin && !isSelf)) {
            throw new CustomError("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        await UserRepository.update(userToUpdate);

        const userUpdated = await this.get(userToUpdate.id);

        HistoryRepository.Add({
            action: "update",
            entityId: userUpdated?.id ?? null,
            entityType: "user",
            newData: userUpdated,
            oldData: userToUpdateType,
            userId: this.currentUser.id!,
        });

        return userUpdated;
    }
}
