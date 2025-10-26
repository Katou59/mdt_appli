import CitizenRepository from "@/repositories/citizen-repository";
import HistoryRepository from "@/repositories/history-repository";
import Citizen from "@/types/class/Citizen";
import User from "@/types/class/User";
import { CitizenToCreateType, CitizenToUpdateType } from "@/types/db/citizen";
import { HttpStatus } from "@/types/enums/http-status-enum";
import CustomError from "@/types/errors/CustomError";
import UserService from "./user-service";

export default class CitizenService {
    public readonly currentUser;
    constructor(currentUser: User) {
        this.currentUser = currentUser;
    }

    public static async create(currentUserId: string) {
        return new CitizenService((await UserService.create(currentUserId)).currentUser);
    }

    public async getList(page: number, itemPerPage: number, searchTerm: string | null) {
        return await CitizenRepository.getList(page, itemPerPage, searchTerm ?? undefined);
    }

    public async add(citizenToAdd: CitizenToCreateType) {
        const newCitizenId = await CitizenRepository.add(citizenToAdd, this.currentUser);

        HistoryRepository.add({
            action: "create",
            entityId: newCitizenId,
            entityType: "citizen",
            newData: await CitizenRepository.get(newCitizenId),
            oldData: null,
            userId: this.currentUser.id,
        });

        return this.get(newCitizenId);
    }

    public async get(citizenId: string): Promise<Citizen> {
        const citizen = await CitizenRepository.get(citizenId);
        if (!citizen) {
            throw new CustomError("Not found", HttpStatus.NOT_FOUND);
        }

        return citizen;
    }

    public async update(citizenToUpdate: CitizenToUpdateType): Promise<Citizen> {
        const existedCitizen = await CitizenRepository.get(citizenToUpdate.id);
        if (!existedCitizen) {
            throw new CustomError("Not found", HttpStatus.NOT_FOUND);
        }

        await CitizenRepository.update(citizenToUpdate, this.currentUser);

        const result = await this.get(citizenToUpdate.id);

        HistoryRepository.add({
            action: "update",
            entityId: citizenToUpdate.id,
            entityType: "citizen",
            newData: result,
            oldData: existedCitizen,
            userId: this.currentUser.id,
        });

        return result;
    }
}
