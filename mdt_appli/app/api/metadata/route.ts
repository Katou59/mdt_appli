import { auth } from "@/auth";
import BloodTypeRepository from "@/repositories/bloodTypeRepository";
import ErrorLogRepository from "@/repositories/errorLogRepository";
import GenderRepository from "@/repositories/genderRepository";
import JobRepository from "@/repositories/jobRepository";
import NationalityRepository from "@/repositories/nationalityRepository";
import RankRepository from "@/repositories/rankRepository";
import RoleRepository from "@/repositories/roleRepository";
import { HttpStatus } from "@/types/enums/httpStatus";
import { KeyValueType } from "@/types/utils/keyValue";
import { MetadataType } from "@/types/utils/metadata";
import { Key } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const jobs = await JobRepository.GetList();
        const ranks = await RankRepository.GetList();
        const roles = await RoleRepository.GetList();
        const nationalities = await NationalityRepository.GetList();
        const genders = await GenderRepository.GetList();
        const bloodTypes = await BloodTypeRepository.GetList();

        const results: MetadataType = {
            jobs,
            ranks,
            roles,
            nationalities,
            genders,
            bloodTypes,
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
