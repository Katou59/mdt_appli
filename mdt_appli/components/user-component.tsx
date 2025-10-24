import { UserToUpdateType, UserType } from "@/types/db/user";
import UserConsult from "./user-consult";
import UserUpdate from "./user-update";

export default function UserComponent(props: {
    user: UserType;
    isConsult: boolean;
    isAdmin?: boolean;
    jobs: { label: string; value: string }[];
    ranks: { label: string; value: string }[];
    roles: { label: string; value: string }[];
    onJobChange: (jobId: string) => void;
    onSubmit: (values: UserToUpdateType) => Promise<void>;
    onCancel?: () => void;
}) {
    return (
        <div className="flex items-center justify-center">
            {props.isConsult ? (
                <UserConsult userToUpdate={props.user} />
            ) : (
                <UserUpdate
                    userToUpdate={props.user}
                    isAdmin={props.isAdmin}
                    jobs={props.jobs}
                    ranks={props.ranks}
                    roles={props.roles}
                    onJobChange={props.onJobChange}
                    onSubmit={props.onSubmit}
                    onCancel={props.onCancel}
                />
            )}
        </div>
    );
}
