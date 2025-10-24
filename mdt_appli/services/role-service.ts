import RoleRepository from "@/repositories/role-repository";
import User from "@/types/class/User";

export default class RoleService {
    public readonly currentUser;
    constructor(currentUser: User) {
        this.currentUser = currentUser;
    }

    public async getList() {
        return await RoleRepository.getList();
    }
}
