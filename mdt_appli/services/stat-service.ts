import User from "@/types/class/User";
import ServiceBase from "./service-base";

export default class StatService extends ServiceBase {
    constructor(currentUser: User) {
        super(currentUser);
    }
}
