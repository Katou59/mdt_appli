"use client";

import { useUser } from "@/lib/Contexts/UserContext";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import axiosClient, { getData } from "@/lib/axiosClient";
import Rank from "@/types/class/Rank";
import { RankType } from "@/types/db/rank";
import Alert from "@/components/Alert";
import Job from "@/types/class/Job";
import { JobType } from "@/types/db/job";

export default function Ranks() {
	const { user } = useUser();
	const router = useRouter();
	const [ranks, setRanks] = useState<Rank[]>([]);
	const [jobs, setJobs] = useState<Job[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");
	const [selectedJobId, setSelectedJobId] = useState(0);

	useEffect(() => {
		if (!user?.isAdmin) {
			return router.push("/police/dashboard");
		}

		const fetchRanks = async () => {
			const jobsResponse = await getData(axiosClient.get<JobType[]>("/jobs"));
			if (jobsResponse.errorMessage) {
				setErrorMessage(jobsResponse.errorMessage);
			}

			if (jobsResponse.data) {
				setJobs(jobsResponse.data.map((x) => new Job(x)));
			}

			if (!jobsResponse.data) {
				setIsLoading(false);
				return;
			}

			setSelectedJobId(jobsResponse.data[0].id!);

			const ranksResponse = await getData(
				axiosClient.get<RankType[]>(`/ranks/${jobsResponse.data[0].id!}`)
			);
			if (ranksResponse.errorMessage) {
				setErrorMessage(ranksResponse.errorMessage);
			}

			if (ranksResponse.data) {
				const results = ranksResponse.data
					.map((x) => new Rank(x))
					.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
				setRanks(results);
			}
			setIsLoading(false);
		};

		fetchRanks();
	}, [router, user]);

	if (isLoading) return <div>Chargement...</div>;

	// 🔹 Drag start
	const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
		e.dataTransfer.setData("dragIndex", index.toString());
	};

	// 🔹 Drop
	const handleDrop = async (e: React.DragEvent<HTMLLIElement>, dropIndex: number) => {
		e.preventDefault();
		const dragIndex = Number(e.dataTransfer.getData("dragIndex"));
		if (dragIndex === dropIndex) return;

		const updated = [...ranks];
		const [removed] = updated.splice(dragIndex, 1);
		updated.splice(dropIndex, 0, removed);

		let index = 0;
		updated.forEach((u) => {
			index++;
			u.order = index;
		});

		try {
			const results = await axiosClient.put<RankType[]>(
				"/ranks",
				updated.map((r) => r.toRankType())
			);

			const ranksUpdated = results.data
				.map((x) => new Rank(x))
				.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

			setRanks(ranksUpdated);
		} catch {
			setErrorMessage("Erreur lors de la récupération des grades");
		}
	};

	async function handleNewRankSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const newRankName = data.get("newRankName");

		const job = jobs.find((j) => j.id == selectedJobId)?.toJobType();

		const updated = [
			...ranks,
			new Rank({
				id: null,
				job: job ?? null,
				order: getLastOrder(ranks) + 1,
				name: newRankName as string,
				userCount: undefined,
			}),
		];

		const result = await getData(
			axiosClient.put<RankType[]>(
				"/ranks",
				updated.map((r) => r.toRankType())
			)
		);

		if (result.errorMessage) {
			setErrorMessage(result.errorMessage);
			return;
		}

		const ranksUpdated = (result.data as RankType[])
			.map((x) => new Rank(x))
			.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

		setRanks(ranksUpdated);
		

		const modal = document.getElementById("addRank") as HTMLDialogElement | null;
		if (modal) {
			modal.close();
		}
	}

	async function handleDeleteRank(e: MouseEvent<HTMLButtonElement>, id: number): Promise<void> {
		e.preventDefault();
		const result = await getData(axiosClient.delete(`/ranks/${id}`));
		if (result.status === 409) {
			setErrorMessage("Il y a des utilisateurs qui ont ce grade");
			return;
		} else if (result.errorMessage) {
			setErrorMessage(result.errorMessage);
			return;
		}

		setRanks((prev) => prev.filter((r) => r.id !== id));
	}

	return (
		<>
			<Alert message={errorMessage} />
			<div className="flex flex-col justify-center items-center w-full">
				<h1 className="text-4xl font-bold text-primary text-center mb-4">
					Liste des Rangs
				</h1>

				<select
					className="select"
					value={selectedJobId}
					onChange={async (e) => {
						setSelectedJobId(Number(e.target.value));
						const ranksResponse = await getData(
							axiosClient.get<RankType[]>(`/ranks/${Number(e.target.value)}`)
						);

						if (ranksResponse.errorMessage) {
							setErrorMessage(ranksResponse.errorMessage);
							return;
						}

						if (ranksResponse.data) {
							const results = ranksResponse.data
								.map((x) => new Rank(x))
								.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
							setRanks(results);
						}
					}}
				>
					{jobs.map((x) => (
						<option key={x.id} value={x.id!}>
							{x.id!} {x.name}
						</option>
					))}
				</select>

				{/* Liste des rangs */}
				<p className="text-xs text-center w-96 mt-4">
					{ranks.length > 0
						? "Drag & drop pour changer l&apos;ordre"
						: "La liste est vide"}
				</p>
				<ul className="list bg-base-200 rounded-box shadow-md mt-2 w-96">
					{ranks.map((rank, index) => (
						<li
							key={rank.order}
							draggable
							onDragStart={(e) => handleDragStart(e, index)}
							onDragOver={(e) => e.preventDefault()}
							onDrop={(e) => handleDrop(e, index)}
							className="list-row hover:cursor-pointer h-13 flex items-center gap-2 px-2 hover:bg-base-300"
						>
							<div className="flex flex-row w-full">
								<div className="font-thin opacity-30 tabular-nums">
									{rank.order}
								</div>
								<div className="list-col-grow grow ml-2">
									{rank.name}
									<span className="text-xs opacity-30 ml-1">
										{rank.userCount} utilisateur
										{rank.userCount && rank.userCount > 0 ? "s" : ""}
									</span>
								</div>
								{!rank.userCount ||
									(rank.userCount < 1 && (
										<button
											className="btn btn-xs btn-error rounded-xl"
											onClick={(e) => handleDeleteRank(e, rank.id!)}
										>
											Supprimer
										</button>
									))}
							</div>
						</li>
					))}
				</ul>

				{/* Bouton ajouter */}
				<button
					className="btn btn-info rounded-xl mt-2"
					onClick={() => {
						setErrorMessage("");
						const modal = document.getElementById(
							"addRank"
						) as HTMLDialogElement | null;
						if (modal) {
							modal.showModal();
						}
					}}
				>
					Ajouter
				</button>

				{/* Modal ajout */}
				<dialog id="addRank" className="modal modal-bottom sm:modal-middle">
					<form onSubmit={handleNewRankSubmit} className="modal-box">
						<h3 className="font-bold text-lg">Ajout d&apos;un nouveau rang</h3>
						<fieldset className="fieldset">
							<legend className="fieldset-legend">Nom du rang</legend>
							<input
								type="text"
								className="input w-full"
								name="newRankName"
								placeholder="Nouveau rang"
								autoComplete="off"
								required
							/>
						</fieldset>
						<div className="modal-action join gap-0 flex">
							<button
								type="reset"
								className="btn btn-error join-item"
								onClick={() => {
									const modal = document.getElementById(
										"addRank"
									) as HTMLDialogElement | null;
									if (modal) {
										modal.close();
									}
								}}
							>
								Annuler
							</button>
							<button type="submit" className="btn btn-success join-item">
								Valider
							</button>
						</div>
					</form>
				</dialog>
			</div>
		</>
	);
}

function getLastOrder(ranks: Rank[]) {
	if (ranks.length === 0) return 0;
	const orders = ranks.map((r) => r.order ?? 0);
	return Math.max(...orders);
}
