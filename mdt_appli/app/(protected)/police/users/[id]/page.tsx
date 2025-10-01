"use client";

import { useParams } from "next/navigation";
import {useEffect, useState} from "react";
import {UserType} from "@/types/db/user";
import axiosClient from "@/lib/axiosClient";
import UserComponent from "@/components/UserComponent";

export default function User(){
    const params = useParams<{ id: string }>();
    const [user, setUser] = useState<UserType>();
    
    useEffect(()=>{
        axiosClient.get(`/users/${params.id}`).then(user => {
            const result =user.data as UserType;
            setUser(result);
        })
    }, [])
    
    if(!user) return <div>Chargement...</div>
    
    return (
        <UserComponent user={user} isConsult={true}/>
    )
}