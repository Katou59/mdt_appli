import StatusRepository from "@/repositories/status-repository";
import User from "@/types/class/User";
import ServiceBase from "./service-base";

export default class StatusService extends ServiceBase {
    constructor(currentUser: User) {
        super(currentUser);
    }

    public async getList() {
        return await StatusRepository.getList();
    }
}
