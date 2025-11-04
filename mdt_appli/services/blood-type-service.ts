import BloodTypeRepository from "@/repositories/blood-type-repository";
import User from "@/types/class/User";
import ServiceBase from "./service-base";

export default class BloodTypeService extends ServiceBase {
    constructor(currentUser: User) {
        super(currentUser);
    }

    public async getList() {
        return await BloodTypeRepository.getList();
    }
}
