import BloodTypeRepository from "@/repositories/blood-type-repository";
import User from "@/types/class/User";

export default class BloodTypeService {
    public readonly currentUser;
    constructor(currentUser: User) {
        this.currentUser = currentUser;
    }

    public async getList() {
        return await BloodTypeRepository.getList();
    }
}
