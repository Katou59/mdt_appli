import NationalityRepository from "@/repositories/nationality-repository";
import User from "@/types/class/User";

export default class NationalityService {
    public readonly currentUser;
    constructor(currentUser: User) {
        this.currentUser = currentUser;
    }

    public async getList() {
        return await NationalityRepository.getList();
    }
}
