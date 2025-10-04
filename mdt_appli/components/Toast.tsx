"use client";

export default function Toast(props: { message: string; type: "success" | "info" }) {
	if (!props.message) return null;

	if (props.type == "success") {
		return (
			<div className="toast toast-end">
				<div className="alert alert-success font-bold">
					<span>{props.message}</span>
				</div>
			</div>
		);
	}

	return (
		<div className="toast toast-end">
			<div className="alert alert-info font-bold">
				<span>{props.message}</span>
			</div>
		</div>
	);
}
