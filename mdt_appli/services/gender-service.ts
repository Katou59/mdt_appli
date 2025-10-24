import GenderRepository from "@/repositories/gender-repository";
import User from "@/types/class/User";

export default class GenderService {
    public readonly currentUser;
    constructor(currentUser: User) {
        this.currentUser = currentUser;
    }

    public async getList() {
        return await GenderRepository.getList();
    }
}
