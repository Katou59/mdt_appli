"use client";

import { useUser } from "@/lib/Contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";
import Rank from "@/types/class/Rank";
import { RankType } from "@/types/db/rank";

export default function Ranks() {
	const { user } = useUser();
	const router = useRouter();
	const [ranks, setRanks] = useState<Rank[]>([]);
	const [initialRanks, setInitialRanks] = useState<Rank[]>([]);
	const [isLoading, setIsLoading] = useState(true);

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
				setInitialRanks(results); // copie pour reset
			} catch (error) {
				console.error("Erreur lors du fetch des ranks :", error);
			} finally {
				setIsLoading(false);
			}
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

		const results = await axiosClient.put<RankType[]>(
			"/ranks",
			updated.map((r) => r.toRankType())
		);

		const ranksUpdated = results.data
			.map((x) => new Rank(x))
			.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

		setRanks(ranksUpdated);
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
			}),
		];

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
	}

	return (
		<div className="flex flex-col justify-center items-center">
			<h1 className="text-4xl font-bold text-primary text-center mb-4">Liste des Rangs</h1>

			{/* Liste des rangs */}
			<ul className="list bg-base-200 rounded-box shadow-md w-64">
				{ranks.map((rank, index) => (
					<li
						key={rank.order}
						draggable
						onDragStart={(e) => handleDragStart(e, index)}
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => handleDrop(e, index)}
						className="list-row hover:cursor-pointer h-13 flex items-center gap-2 px-2 hover:bg-base-300"
					>
						<div className="font-thin opacity-30 tabular-nums">{rank.order}</div>
						<div className="list-col-grow">{rank.name}</div>
					</li>
				))}
			</ul>

			{/* Bouton ajouter */}
			<button
				className="btn btn-info rounded-xl mt-2"
				onClick={() => {
					const modal = document.getElementById("addRank") as HTMLDialogElement | null;
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
	);
}

function getLastOrder(ranks: Rank[]) {
	if (ranks.length === 0) return 0;
	const orders = ranks.map((r) => r.order ?? 0);
	return Math.max(...orders);
}
