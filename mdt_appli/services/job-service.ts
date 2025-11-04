import JobRepository from "@/repositories/job-repository";
import User from "@/types/class/User";
import ServiceBase from "./service-base";

export default class JobService extends ServiceBase {
    constructor(currentUser: User) {
        super(currentUser);
    }

    public async getList() {
        return await JobRepository.getList();
    }
}
