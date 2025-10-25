import User from "@/types/class/User";
import { MetadataType } from "@/types/utils/metadata";
import BloodTypeService from "./blood-type-service";
import GenderService from "./gender-service";
import JobService from "./job-service";
import NationalityService from "./nationality-service";
import RankService from "./ranks-service";
import RoleService from "./role-service";
import StatusService from "./status-service";
import UserService from "./user-service";

export default class MetadataService {
    public readonly currentUser;
    constructor(currentUser: User) {
        this.currentUser = currentUser;
    }

    public static async create(currentUserId: string) {
        const userService = await UserService.create(currentUserId);
        return new MetadataService(userService.currentUser);
    }

    public async get() {
        const rankService = new RankService(this.currentUser);
        const jobService = new JobService(this.currentUser);
        const roleService = new RoleService(this.currentUser);
        const nationalityService = new NationalityService(this.currentUser);
        const genderService = new GenderService(this.currentUser);
        const bloodTypeService = new BloodTypeService(this.currentUser);
        const statusService = new StatusService(this.currentUser);

        const [jobs, ranks, roles, nationalities, genders, bloodTypes, statuses] =
            await Promise.all([
                jobService.getList(),
                rankService.getList(),
                roleService.getList(),
                nationalityService.getList(),
                genderService.getList(),
                bloodTypeService.getList(),
                statusService.getList(),
            ]);

        const results: MetadataType = {
            jobs: jobs.map((x) => x.toJobType()),
            ranks: ranks.map((x) => x.toRankType()),
            roles,
            nationalities,
            genders,
            bloodTypes,
            statuses,
        };

        return results;
    }
}
