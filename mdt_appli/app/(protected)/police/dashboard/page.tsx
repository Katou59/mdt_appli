"use client";

import {signOut} from "next-auth/react";

export default function Dashboard() {
    return (
        <div>
            <button className="btn btn-error" onClick={() => signOut({redirectTo: "/"})}>Déconnexion</button>
        </div>
    )
}