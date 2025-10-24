import { auth } from "@/auth";
import BloodTypeRepository from "@/repositories/blood-type-repository";
import ErrorLogRepository from "@/repositories/error-log-repository";
import GenderRepository from "@/repositories/gender-repository";
import JobRepository from "@/repositories/job-repository";
import NationalityRepository from "@/repositories/nationality-repository";
import RoleRepository from "@/repositories/role-repository";
import StatusRepository from "@/repositories/status-repository";
import RankService from "@/services/ranks-service";
import { HttpStatus } from "@/types/enums/http-status-enum";
import { MetadataType } from "@/types/utils/metadata";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        const discordId = session.user.discordId;
        const rankService = await RankService.create(discordId);

        const jobs = await JobRepository.getList();
        const ranks = await rankService.getList();
        const roles = await RoleRepository.getList();
        const nationalities = await NationalityRepository.getList();
        const genders = await GenderRepository.getList();
        const bloodTypes = await BloodTypeRepository.getList();
        const statuses = await StatusRepository.getList();

        const results: MetadataType = {
            jobs,
            ranks,
            roles,
            nationalities,
            genders,
            bloodTypes,
            statuses,
        };
        return NextResponse.json(results, { status: HttpStatus.OK });
    } catch (error) {
        ErrorLogRepository.Add({
            error: error,
            path: request.nextUrl.href,
            request: null,
            userId: (await auth())!.user!.discordId!,
            method: request.method,
        });
        console.error(error);

        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: HttpStatus.INTERNAL_SERVER_ERROR }
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
        return;
    }
}
