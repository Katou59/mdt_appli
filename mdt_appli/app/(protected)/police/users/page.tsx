"use client";

import {redirect, useRouter} from "next/navigation";
import {UserType} from "@/types/db/user";
import {RoleType} from "@/types/enums/roleType";
import {useUser} from "@/lib/Contexts/UserContext";
import {useEffect, useState} from "react";
import axiosClient from "@/lib/axiosClient";
import User from "@/types/class/User";

export default function Users() {
    const {user} = useUser();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [originalUsers, setOriginUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [pager, setPager] = useState<{ current: number, total: number, max: number }>({
        current: 1,
        total: 0,
        max: 20
    });

    if (!user || user.role != RoleType.Admin) return redirect('/police/dashboard');

    useEffect(() => {
        axiosClient.get(`/users`).then(u => {
            const results = u.data as UserType[];
            const allUsers = results.map(u => new User(u));
            setOriginUsers(allUsers);

            const totalPages = Math.ceil(allUsers.length / pager.max);

            setPager(prev => ({
                ...prev,
                current: 1,
                total: totalPages,
            }));

            setUsers(allUsers.slice(0, pager.max));
            setIsLoading(false);
        });
    }, []);

    function handleTh(e: React.MouseEvent<HTMLTableHeaderCellElement>, type: "name" | "email" | "number" | "lastName" | "rank" | "role" | "isDisable") {
        e.preventDefault();

        let results: User[] = [];

        switch (type) {
            case "name":
                results = originalUsers.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
                break;
            case "email":
                results = originalUsers.sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""));
                break;
            case "number":
                results = originalUsers.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
                break;
            case "lastName":
                results = originalUsers.sort((a, b) => (a.lastName ?? "").localeCompare(b.lastName ?? ""));
                break;
            case "rank":
                results = originalUsers.sort((a, b) => (a.rank?.name ?? "").localeCompare(b.rank?.name ?? ""));
                break;
            case "role":
                results = originalUsers.sort((a, b) => (a.role ?? 0) - (b.role ?? 0));
                break;
        }

        setUsers([...results.slice(0, pager.max)]);
        setPager({...pager, current: 1})
        setOriginUsers([...results]);
    }

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let value = searchTerm.trim().toLowerCase();

        if (e.type === "reset") {
            value = "";
            setSearchTerm(value);
        }

        if (!value) {
            const totalPages = Math.ceil(originalUsers.length / pager.max);
            setPager(prev => ({...prev, current: 1, total: totalPages}));
            setUsers([...originalUsers].slice(0, pager.max));
            return;
        }

        const results = originalUsers.filter(user => {
            const fields = [
                user.name,
                user.email,
                user.firstName,
                user.lastName,
                user.id,
                user.number?.toString()
            ];
            return fields.some(f => f?.toLowerCase().includes(value));
        });

        const totalPages = Math.ceil(results.length / pager.max);
        setPager(prev => ({...prev, current: 1, total: totalPages}));
        setUsers(results.slice(0, pager.max));
    }

    const handlePageChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, page: number) => {
        e.preventDefault();

        const totalPages = Math.ceil(originalUsers.length / pager.max);
        const safePage = Math.max(1, Math.min(page, totalPages));

        const start = (safePage - 1) * pager.max;
        const end = safePage * pager.max;

        setPager(prev => ({...prev, current: safePage}));
        setUsers(originalUsers.slice(start, end));
    }

    if (isLoading) return <div>Chargement...</div>

    return (
        <div className="">
            <h1 className="text-4xl font-bold text-primary text-center mb-4">Liste des utilisateurs</h1>
            <form onSubmit={handleSearchSubmit} onReset={handleSearchSubmit}>
                <input
                    type="text"
                    name="search"
                    placeholder="Recherche"
                    className="input input-sm input-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoComplete="off"
                />
                <button type="submit" className="btn btn-success btn-sm rounded-l-xl w-24 ml-4">Rechercher</button>
                <button type="reset" className="btn btn-error btn-sm rounded-r-xl w-24">Annuler</button>
            </form>
            <table className="table table-xs mt-4">
                <thead>
                <tr>
                    <th>Id</th>
                    <th className="hover:cursor-pointer" onClick={(e) => handleTh(e, "name")}>Nom Discord</th>
                    <th className="hover:cursor-pointer" onClick={(e) => handleTh(e, "email")}>Email</th>
                    <th className="hover:cursor-pointer" onClick={(e) => handleTh(e, "number")}>Matricule</th>
                    <th className="hover:cursor-pointer" onClick={(e) => handleTh(e, "lastName")}>Nom Prénom</th>
                    <th className="hover:cursor-pointer" onClick={(e) => handleTh(e, "rank")}>Grade</th>
                    <th className="hover:cursor-pointer" onClick={(e) => handleTh(e, "role")}>Role</th>
                    <th>Est désactivé</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user: User) => (
                    <tr 
                        key={user.id} 
                        className="hover:bg-base-300 hover:cursor-pointer"
                        onClick={(e) => router.push(`/police/users/${user.id}`)}>
                        <th>{user.id}</th>
                        <th>{user.name}</th>
                        <td>{user.email}</td>
                        <td>{user.number}</td>
                        <td>{user.lastName} {user.firstName}</td>
                        <td>{user.rank?.name}</td>
                        <td>{RoleType[user.role]}</td>
                        <td>{user.isDisable ? "Oui" : "Non"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="join flex justify-center mt-4">
                <button
                    className="join-item btn w-10"
                    disabled={pager.current == 1}
                    onClick={(e) => handlePageChange(e, 1)}>
                    {"<<"}
                </button>
                <button
                    className="join-item btn w-10"
                    disabled={pager.current == 1}
                    onClick={(e) => handlePageChange(e, pager.current - 1)}>
                    {"<"}
                </button>
                <button
                    className="join-item btn w-36">
                    Page {pager.current}/{pager.total}
                </button>
                <button
                    className="join-item btn w-10"
                    disabled={pager.current == pager.total}
                    onClick={(e) => handlePageChange(e, pager.current + 1)}>
                    {">"}
                </button>
                <button
                    className="join-item btn w-10"
                    disabled={pager.current == pager.total}
                    onClick={(e) => handlePageChange(e, pager.total)}>
                    {">>"}
                </button>
            </div>
        </div>
    );
}