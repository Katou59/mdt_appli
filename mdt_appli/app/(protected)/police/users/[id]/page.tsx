"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosClient, { getData } from "@/lib/axiosClient";
import UserComponent from "@/components/UserComponent";
import User from "@/types/class/User";
import Alert from "@/components/Alert";

export default function UserId() {
	const params = useParams<{ id: string }>();
	const [user, setUser] = useState<User>();
	const [isLoaded, setIsLoaded] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		async function init() {
			const result = await getData(axiosClient.get(`/users/${params.id}`));
			if (result.errorMessage) {
				setErrorMessage(result.errorMessage);
				setIsLoaded(true);
				return;
			}

			setUser(new User(result.data));
			setIsLoaded(true);
		}

		init();
	}, [params.id]);

	if (!isLoaded) return <div>Chargement du profil...</div>;

	return (
		<>
			<Alert message={errorMessage} />
			{user && <UserComponent user={user!.toUserType()} isConsult={true} />}
		</>
	);
}
