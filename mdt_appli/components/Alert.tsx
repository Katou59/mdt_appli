import { Alert as UIAlert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function Alert(props: { message?: string }) {
    if (!props.message) return null;

    let message = "";

    switch (props.message) {
        case "AccessDenied":
            message = "Vous n'êtes pas authorisé";
            break;
        default:
            message = props.message;
            break;
    }

    return (
        <></>
    );
}
