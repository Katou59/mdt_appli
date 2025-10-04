import { signIn } from "@/auth";
import Alert from "@/components/Alert";
import Image from "next/image";

export default async function PublicHome({ searchParams }: { searchParams?: { error: string } }) {
	console.log(searchParams?.error);
	return (
		<>
			<Alert message={searchParams?.error} />
			<div className="flex flex-row justify-center items-center h-full">
				<form
					action={async () => {
						"use server";
						await signIn("discord", { redirectTo: "/police/dashboard" });
					}}
				>
					<button type="submit" className="cursor-pointer">
						<Image src="/logolspd.webp" alt="Logo LSPD" width={200} height={200} />
					</button>
				</form>
			</div>
		</>
	);
}
