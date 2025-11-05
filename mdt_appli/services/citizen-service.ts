import CitizenRepository from "@/repositories/citizen-repository";
import HistoryRepository from "@/repositories/history-repository";
import Citizen from "@/types/class/Citizen";
import User from "@/types/class/User";
import { CitizenToCreateType, CitizenToUpdateType } from "@/types/commons/citizen";
import { HttpStatus } from "@/types/enums/http-status-enum";
import CustomError from "@/types/errors/CustomError";
import ServiceBase from "./service-base";

export default class CitizenService extends ServiceBase {
    constructor(currentUser: User) {
        super(currentUser);
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

    public async getCount(): Promise<number> {
        return await CitizenRepository.getCount();
    }

    public async getCountCreatedToday(): Promise<number> {
        return CitizenRepository.getCountCreatedToday();
    }
}
