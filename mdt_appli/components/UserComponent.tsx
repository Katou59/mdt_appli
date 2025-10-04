"use client";

import { useEffect, useState } from "react";
import { UserToUpdateType, UserType } from "@/types/db/user";
import axiosClient, { getData } from "@/lib/axiosClient";
import Toast from "@/components/Toast";
import { useUser } from "@/lib/Contexts/UserContext";
import dayjs from "dayjs";
import User from "@/types/class/User";
import { RoleType } from "@/types/enums/roleType";
import Rank from "@/types/class/Rank";
import { RankType } from "@/types/db/rank";
import Alert from "./Alert";

export default function UserComponent(props: { user: UserType; isConsult: boolean }) {
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [userToUpdate, setToUserToUpdate] = useState<User>(new User(props.user));
	const [isConsult, setIsConsult] = useState(props.isConsult);
	const [ranks, setRanks] = useState<Rank[]>([]);
	const [errorMessage, setErrorMessage] = useState("");
	const { user, setUser } = useUser();

	useEffect(() => {
		async function init() {
			if (!props.user.rank?.id) return;

			const result = await getData(axiosClient.get(`/ranks/${props.user.rank!.id}`));
			if (result.errorMessage) {
				setErrorMessage(result.errorMessage);
				return;
			}

			const ranks = result.data as RankType[];
			setRanks(ranks.map((x: RankType) => new Rank(x)));
		}

		if (user?.isAdmin) {
			init();
		}
	}, [user?.isAdmin]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		const userType = {
			id: userToUpdate?.id,
			firstName: userToUpdate?.firstName,
			lastName: userToUpdate?.lastName,
			number: userToUpdate?.number,
			phoneNumber: userToUpdate?.phoneNumber,
			rank: userToUpdate?.rank?.toRankType(),
		} as UserToUpdateType;

		const userUpdatedResult = await getData(axiosClient.put(`/users`, userType));
		if (userUpdatedResult.errorMessage) {
			setErrorMessage(userUpdatedResult.errorMessage);
			return;
		}

		setIsSuccess(true);
		setToUserToUpdate(new User(userUpdatedResult.data as UserType));

		if (userToUpdate?.id == user!.id) {
			setUser(new User(userUpdatedResult.data as UserType));
		}
	}

	async function onReset(e: React.FormEvent) {
		e.preventDefault();
		setIsSuccess(false);
		setIsConsult(true);
	}

	if (!userToUpdate) return <p>Chargement du profil…</p>;

	return (
		<>
			<Alert message={errorMessage} />
			<div className="w-full h-full">
				<h1 className="text-4xl font-bold text-primary text-center mb-4">
					{user?.id == userToUpdate.id && "Mon profil"}
					{user?.id != userToUpdate.id &&
						`Profil de ${userToUpdate?.firstName} ${userToUpdate?.lastName}`}
				</h1>
				{isConsult && (user?.isAdmin || user?.id === userToUpdate.id) && (
					<div className="flex justify-end">
						<button
							type="button"
							onClick={(e) => setIsConsult(!isConsult)}
							className="btn btn-info rounded-xl"
						>
							Modifier
						</button>
					</div>
				)}
				<form onSubmit={onSubmit} onReset={onReset}>
					<div className="grid grid-cols-2 gap-4">
						{isConsult && (
							<>
								<fieldset className="fieldset w-full">
									<legend className="fieldset-legend">Id Discord</legend>
									<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
										{userToUpdate.id}
									</div>
								</fieldset>
								<fieldset className="fieldset w-full">
									<legend className="fieldset-legend">Nom Discord</legend>
									<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
										{userToUpdate.name}
									</div>
								</fieldset>
								{(user?.isAdmin || user?.id == userToUpdate.id) && (
									<>
										<fieldset className="fieldset col-span-2 w-1/2 pr-2">
											<legend className="fieldset-legend">Email</legend>
											<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
												{userToUpdate.email}
											</div>
										</fieldset>
									</>
								)}
								{user?.isAdmin && (
									<>
										<fieldset className="fieldset w-full">
											<legend className="fieldset-legend">Rôle</legend>
											<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
												{RoleType[userToUpdate.role]}
											</div>
										</fieldset>
										<fieldset className="fieldset w-full">
											<legend className="fieldset-legend">
												Compte désactivé
											</legend>
											<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
												{userToUpdate.isDisable ? "Oui" : "Non"}
											</div>
										</fieldset>
									</>
								)}
								<div className="divider col-span-2"></div>
								<fieldset className="fieldset w-full">
									<legend className="fieldset-legend">Date de création</legend>
									<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
										{dayjs(userToUpdate.createdAt).format(
											"DD/MM/YYYY HH:mm:ss"
										)}
									</div>
								</fieldset>
								<fieldset className="fieldset w-full">
									<legend className="fieldset-legend">
										Date première connexion
									</legend>
									<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
										{userToUpdate.firstLogin
											? dayjs(userToUpdate.firstLogin).format(
													"DD/MM/YYYY HH:mm:ss"
											  )
											: "Jamais"}
									</div>
								</fieldset>
								<fieldset className="fieldset w-full">
									<legend className="fieldset-legend">
										Date dernière connexion
									</legend>
									<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
										{userToUpdate.lastLogin
											? dayjs(userToUpdate.lastLogin).format(
													"DD/MM/YYYY HH:mm:ss"
											  )
											: "Jamais"}
									</div>
								</fieldset>
								<div className="divider col-span-2"></div>
								<fieldset className="fieldset w-full">
									<legend className="fieldset-legend">Rôle</legend>
									<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
										{userToUpdate.rank?.job?.name}
									</div>
								</fieldset>
								<fieldset className="fieldset w-full">
									<legend className="fieldset-legend">Grade</legend>
									<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
										{userToUpdate.rank?.name}
									</div>
								</fieldset>
							</>
						)}

						{!isConsult && user?.isAdmin && (
							<>
								<fieldset className="fieldset w-full">
									<legend className="fieldset-legend">Rôle</legend>
									<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
										{userToUpdate.rank?.job?.name}
									</div>
								</fieldset>
								<fieldset className="fieldset w-full">
									<legend className="fieldset-legend">Grade</legend>
									{isConsult && (
										<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold">
											{userToUpdate.lastName}
										</div>
									)}
									{!isConsult && (
										<select
											defaultValue={userToUpdate.rank?.id ?? ""}
											className="select w-full"
											onChange={(e) => {
												const r = ranks.find(
													(rank) => rank.id === Number(e.target.value)
												)!;

												setToUserToUpdate(
													new User({ ...userToUpdate, rank: r })
												);
											}}
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
									)}
								</fieldset>
							</>
						)}

						<fieldset className="fieldset w-full">
							<legend className="fieldset-legend">Nom</legend>
							{isConsult && (
								<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
									{userToUpdate.lastName}
								</div>
							)}
							{!isConsult && (
								<input
									type="text"
									name="lastName"
									className="input w-full"
									placeholder="Nom"
									value={userToUpdate!.lastName ?? ""}
									onChange={(e) => {
										setIsSuccess(false);
										setToUserToUpdate(
											new User({
												...userToUpdate.toUserType(),
												lastName: e.target.value,
											})
										);
									}}
									autoComplete="off"
									required={true}
								/>
							)}
						</fieldset>
						<fieldset className="fieldset">
							<legend className="fieldset-legend">Prénom</legend>
							{isConsult && (
								<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
									{userToUpdate.firstName}
								</div>
							)}
							{!isConsult && (
								<input
									type="text"
									name="firstName"
									className="input w-full"
									placeholder="Prénom"
									value={userToUpdate.firstName ?? ""}
									onChange={(e) => {
										setIsSuccess(false);
										setToUserToUpdate(
											new User({
												...userToUpdate.toUserType(),
												firstName: e.target.value,
											})
										);
									}}
									autoComplete="off"
									disabled={isConsult}
									required={true}
								/>
							)}
						</fieldset>
						<fieldset className="fieldset">
							<legend className="fieldset-legend">Matricule</legend>
							{isConsult && (
								<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
									{userToUpdate.number}
								</div>
							)}
							{!isConsult && (
								<input
									type="number"
									name="number"
									className="input w-full"
									placeholder="Matricule"
									min={1}
									max={100000}
									value={userToUpdate.number ?? ""}
									onChange={(e) => {
										setIsSuccess(false);
										setToUserToUpdate(
											new User({
												...userToUpdate.toUserType(),
												number: Number(e.target.value),
											})
										);
									}}
									autoComplete="off"
									disabled={isConsult}
									required={true}
								/>
							)}
						</fieldset>
						<fieldset className="fieldset">
							<legend className="fieldset-legend">Téléphone</legend>
							{isConsult && (
								<div className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">
									{userToUpdate.phoneNumber}
								</div>
							)}
							{!isConsult && (
								<input
									type="text"
									name="phoneNumber"
									className="input w-full"
									placeholder="Numéro de téléphone"
									min={1}
									max={5000}
									value={userToUpdate.phoneNumber ?? ""}
									onChange={(e) => {
										setIsSuccess(false);
										setToUserToUpdate(
											new User({
												...userToUpdate.toUserType(),
												phoneNumber: e.target.value,
											})
										);
									}}
									autoComplete="off"
									disabled={isConsult}
									required={true}
								/>
							)}
						</fieldset>
					</div>
					{!isConsult && (
						<div className="flex flex-row justify-center mt-4">
							<button type="reset" className="btn btn-error rounded-l-xl w-32">
								Annuler
							</button>
							<button type="submit" className="btn btn-success rounded-r-xl w-32">
								Valider
							</button>
						</div>
					)}
				</form>
				{isSuccess && <Toast message="Mise à jour effectuée" type="success" />}
			</div>
		</>
	);
}
