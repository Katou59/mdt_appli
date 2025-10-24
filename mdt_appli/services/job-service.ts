import JobRepository from "@/repositories/job-repository";
import User from "@/types/class/User";

export default class JobService {
    public readonly currentUser;
    constructor(currentUser: User) {
        this.currentUser = currentUser;
    }

    public async getList() {
        return await JobRepository.getList();
    }
}
