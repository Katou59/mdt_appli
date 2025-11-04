import FineRepository from "@/repositories/fine-repostitory";
import User from "@/types/class/User";
import ServiceBase from "./service-base";

export default class FineService extends ServiceBase {
    constructor(currentUser: User) {
        super(currentUser);
    }

    public async getList() {
        return await FineRepository.getList();
    }

    public async getCount(): Promise<number> {
        return await FineRepository.getCount();
    }
}
