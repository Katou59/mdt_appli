"use client";

import Alert from "@/components/Alert";
import Toast from "@/components/Toast";
import axiosClient, { getData } from "@/lib/axiosClient";
import { useUser } from "@/lib/Contexts/UserContext";
import Job from "@/types/class/Job";
import Rank from "@/types/class/Rank";
import { JobType } from "@/types/db/job";
import { RankType } from "@/types/db/rank";
import { UserToCreateType } from "@/types/db/user";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AddUser() {
	const { user } = useUser();
	const router = useRouter();
	const [isLoaded, setIsLoaded] = useState(false);
	const [jobs, setJobs] = useState<Job[]>([]);
	const [ranks, setRanks] = useState<Rank[]>([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [userToCreate, setUserToCreate] = useState<UserToCreateType>({
		id: "",
		jobId: null,
		rankId: null,
	});

	useEffect(() => {
		async function init() {
			if (!user?.isAdmin) {
				router.push("/police/dashboard");
				return;
			}

			const jobsResponse = await getData(axiosClient.get("/jobs"));
			if (jobsResponse.errorMessage) {
				setErrorMessage(jobsResponse.errorMessage);
				setIsLoaded(true);
			}

			setJobs((jobsResponse.data as JobType[]).map((x) => new Job(x)));
			setIsLoaded(true);
		}

		init();
	}, [router, user]);

	if (!isLoaded) return <div>Chargement...</div>;

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();

		const userCreated = await getData(axiosClient.post("/users", userToCreate));
		if (userCreated.errorMessage) {
			setErrorMessage(userCreated.errorMessage);
			return;
		}

		setSuccessMessage("Utilisateur créé");
	}

	return (
		<>
			<Toast type="success" message={successMessage} />
			<Alert message={errorMessage} />
			<form className="flex flex-col justify-center" onSubmit={handleSubmit}>
				<h1 className="text-4xl font-bold text-primary text-center mb-4">
					Ajouter un nouvel utilisateur
				</h1>
				<div className="grid grid-cols-2 gap-2">
					<fieldset className="fieldset col-span-2 w-1/2 pr-1">
						<legend className="fieldset-legend">Id Discord</legend>
						<input
							type="text"
							name="discordId"
							className="input w-full"
							placeholder="Id Discord"
							value={userToCreate.id}
							onChange={(e) => {
								setUserToCreate({ ...userToCreate, id: e.target.value });
							}}
							autoComplete="off"
							required={true}
						/>
					</fieldset>
					<fieldset className="fieldset">
						<legend className="fieldset-legend">Rôle</legend>
						<select
							className="select w-full"
							defaultValue={userToCreate?.jobId ?? ""}
							onChange={async (e) => {
								e.preventDefault();
								const ranksResponse = await getData(
									axiosClient.get(`/ranks/${e.target.value}`)
								);
								if (ranksResponse.errorMessage) {
									setErrorMessage(ranksResponse.errorMessage);
									return;
								}

								const ranks = (ranksResponse.data as RankType[]).map(
									(x) => new Rank(x)
								);

								setUserToCreate({
									...userToCreate,
									jobId: Number(e.target.value),
									rankId: null,
								});

								setRanks(ranks);
							}}
							required={true}
						>
							<option value="" disabled={true}>
								Choisir
							</option>
							{jobs?.map((x) => {
								return (
									<option key={x.id} value={x.id!}>
										{x.name}
									</option>
								);
							})}
						</select>
					</fieldset>
					<fieldset className="fieldset">
						<legend className="fieldset-legend">Grade</legend>
						<select
							className="select w-full"
							value={userToCreate.rankId ?? ""}
							onChange={(e) => {
								setUserToCreate({
									...userToCreate,
									rankId: Number(e.target.value),
								});
							}}
							required={true}
						>
							<option value="" disabled={true}>
								Choisir
							</option>
							{ranks?.map((x) => {
								return (
									<option key={x.id} value={x.id!}>
										{x.name}
									</option>
								);
							})}
						</select>
					</fieldset>
				</div>
				<div className="flex justify-center join mt-4">
					<button type="reset" className="btn btn-error join-item w-30">
						Annuler
					</button>
					<button type="submit" className="btn btn-success join-item w-30">
						Valider
					</button>
				</div>
			</form>
		</>
	);
}
