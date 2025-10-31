import FineRepository from "@/repositories/fine-repostitory";
import User from "@/types/class/User";

export default class FineService {
    private readonly currentUser: User;

    constructor(currentUser: User) {
        this.currentUser = currentUser;
    }

    public async getList() {
        return await FineRepository.getList();
    }
}
