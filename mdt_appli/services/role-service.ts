import RoleRepository from "@/repositories/role-repository";
import User from "@/types/class/User";
import ServiceBase from "./service-base";

export default class RoleService extends ServiceBase {
    constructor(currentUser: User) {
        super(currentUser);
    }

    public async getList() {
        return await RoleRepository.getList();
    }
}
