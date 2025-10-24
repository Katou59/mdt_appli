import StatusRepository from "@/repositories/status-repository";
import User from "@/types/class/User";

export default class StatusService {
    public readonly currentUser;
    constructor(currentUser: User) {
        this.currentUser = currentUser;
    }

    public async getList() {
        return await StatusRepository.getList();
    }
}
