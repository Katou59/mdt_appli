import CitizenRepository from "@/repositories/citizenRepository";
import React from "react";

export default async function Test() {
    const c = await CitizenRepository.GetList();

    return <h1 className="text-2xl text-primary">TEST</h1>;
}
