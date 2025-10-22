import React from "react";
import { Spinner } from "./ui/spinner";

export default function Loader() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Spinner className="size-16 text-primary" />
        </div>
    );
}
