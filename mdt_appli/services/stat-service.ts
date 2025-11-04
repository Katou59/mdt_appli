import User from "@/types/class/User";
import { StatType } from "@/types/commons/stat";
import CitizenService from "./citizen-service";
import FineService from "./fine-service";
import ServiceBase from "./service-base";
import UserService from "./user-service";

export default class StatService extends ServiceBase {
    constructor(currentUser: User) {
        super(currentUser);
    }

    public async get(jobId: number): Promise<StatType> {
        const userService = new UserService(this.currentUser);
        const citizenService = new CitizenService(this.currentUser);
        const fineService = new FineService(this.currentUser);

        const [userCount, citizenCount, fineCount] = await Promise.all([
            userService.getCount(jobId),
            citizenService.getCount(),
            fineService.getCount(),
        ]);

        return {
            userCount: userCount,
            citizenCount: citizenCount,
            citizenFineCount: fineCount,
        };
    }
}
