import React from "react";

export default async function Citizen({ params }: { params: { id: string } }) {
    return <div>{params.id}</div>;
}
