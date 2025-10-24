import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

type Props = {
    children?: React.ReactNode;
    title: string;
    description: string;
};

export default function UserCard({ children, title, description }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 mt-3">{children}</CardContent>
        </Card>
    );
}
