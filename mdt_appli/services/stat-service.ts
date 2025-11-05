import User from "@/types/class/User";
import { StatType } from "@/types/response/stat-type";
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

        const [userCount, citizenCount, fineCount, userCountToday, citizenCountToday] =
            await Promise.all([
                userService.getCount(jobId),
                citizenService.getCount(),
                fineService.getCount(),
                userService.getCountCreatedToday(jobId),
                citizenService.getCountCreatedToday(),
            ]);

        console.log(userCountToday);

        return {
            user: { count: userCount, countToday: userCountToday },
            citizen: { count: citizenCount, countToday: citizenCountToday },
            citizenFineCount: fineCount,
        };
    }
}
