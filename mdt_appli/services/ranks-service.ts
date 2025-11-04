import HistoryRepository from "@/repositories/history-repository";
import RankRepository from "@/repositories/rank-repository";
import Rank from "@/types/class/Rank";
import User from "@/types/class/User";
import { HttpStatus } from "@/types/enums/http-status-enum";
import CustomError from "@/types/errors/CustomError";
import ServiceBase from "./service-base";

export default class RankService extends ServiceBase {
    constructor(currentUser: User) {
        super(currentUser);
    }

    public async getList(jobId?: number) {
        const ranks = await RankRepository.getList(jobId);
        return ranks;
    }

    public async update(ranks: Rank[]) {
        const oldRanks = await RankRepository.getList(ranks[0]?.job?.id ?? undefined);

        // suppression des grades
        for (const oldRank of oldRanks) {
            const rankToKeep = ranks.find((x) => x.id === oldRank.id);
            if (!rankToKeep) {
                await RankRepository.Delete(oldRank.id!);
            }
        }

        await RankRepository.AddOrUpdateList(ranks);

        const results = await RankRepository.getList();

        HistoryRepository.add({
            action: "update",
            entityId: null,
            entityType: "rank",
            newData: results,
            oldData: oldRanks,
            userId: this.currentUser.id,
        });

        return results;
    }

    public async get(id: number) {
        const rank = await RankRepository.get(id);
        if (!rank) {
            throw new CustomError("Rank not found", HttpStatus.NOT_FOUND);
        }

        return rank;
    }
}
