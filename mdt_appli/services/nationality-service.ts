import NationalityRepository from "@/repositories/nationality-repository";
import User from "@/types/class/User";
import ServiceBase from "./service-base";

export default class NationalityService extends ServiceBase {
    constructor(currentUser: User) {
        super(currentUser);
    }

    public async getList() {
        return await NationalityRepository.getList();
    }
}
