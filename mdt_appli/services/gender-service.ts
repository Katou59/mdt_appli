import GenderRepository from "@/repositories/gender-repository";
import User from "@/types/class/User";
import ServiceBase from "./service-base";

export default class GenderService extends ServiceBase {
    constructor(currentUser: User) {
        super(currentUser);
    }

    public async getList() {
        return await GenderRepository.getList();
    }
}
