"use client";

import { useUser } from "@/lib/Contexts/UserContext";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";
import Rank from "@/types/class/Rank";
import { RankType } from "@/types/db/rank";
import { AxiosError } from "axios";
import Alert from "@/components/Alert";

export default function Ranks() {
	const { user } = useUser();
	const router = useRouter();
	const [ranks, setRanks] = useState<Rank[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (!user?.isAdmin) {
			return router.push("/police/dashboard");
		}

		const fetchRanks = async () => {
			try {
				const { data } = await axiosClient.get<RankType[]>("/ranks");
				const results = data
					.map((x) => new Rank(x))
					.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

				setRanks(results);
			} catch {
				setErrorMessage("Erreur lors de la récupération des grades");
			} finally {
				setIsLoading(false);
			}
		};

		setErrorMessage("");
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

		const updated = [
			...ranks,
			new Rank({
				id: null,
				job: null,
				order: getLastOrder(ranks) + 1,
				name: newRankName as string,
				userCount: undefined,
			}),
		];

		try {
			const results = await axiosClient.put<RankType[]>(
				"/ranks",
				updated.map((r) => r.toRankType())
			);

			const ranksUpdated = results.data
				.map((x) => new Rank(x))
				.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

			setRanks(ranksUpdated);

			const modal = document.getElementById("addRank") as HTMLDialogElement | null;
			if (modal) {
				modal.close();
			}
		} catch {
			setErrorMessage("Erreur lors de la récupération des grades");
		}
	}

	async function handleDeleteRank(e: MouseEvent<HTMLButtonElement>, id: number): Promise<void> {
		e.preventDefault();
		try {
			await axiosClient.delete(`/ranks/${id}`);
			setRanks((prev) => prev.filter((r) => r.id !== id));
		} catch (e) {
			if (e instanceof AxiosError && e.status === 409) {
				setErrorMessage("Il y a des utilisateurs qui ont ce grade");
			}

			setErrorMessage("Une erreur est survenue");
		}
	}

	return (
		<>
			<Alert message={errorMessage} />
			<div className="flex flex-col justify-center items-center w-full">
				<h1 className="text-4xl font-bold text-primary text-center mb-4">
					Liste des Rangs
				</h1>

				{/* Liste des rangs */}
				<p className="text-xs text-center w-96">Drag & drop pour changer l&apos;ordre</p>
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
						<div className="modal-action">
							<button type="submit" className="btn btn-success">
								Valider
							</button>
							<button
								type="reset"
								className="btn btn-error"
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
