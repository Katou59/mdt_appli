import { UserRepository } from "@/repositories/user-repository";
import User from "@/types/class/User";
import { HttpStatus } from "@/types/enums/http-status-enum";
import CustomError from "@/types/errors/CustomError";

export default class ServiceBase {
    public readonly currentUser: User;

    constructor(currentUser: User) {
        this.currentUser = currentUser;
    }

    public static async create<T>(this: new (user: User) => T, currentUserId: string) {
        const currentUser = await UserRepository.get(currentUserId);
        if (!currentUser) throw new CustomError("Not found", HttpStatus.NOT_FOUND);

        return new this(currentUser);
    }
}
