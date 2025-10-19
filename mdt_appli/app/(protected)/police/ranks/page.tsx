"use client";

import { useUser } from "@/lib/Contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosClient, { getData } from "@/lib/axiosClient";
import { RankType } from "@/types/db/rank";
import { JobType } from "@/types/db/job";
import Loader from "@/components/Loader";
import Page from "@/components/Page";
import { useAlert } from "@/lib/Contexts/AlertContext";
import { MetadataType } from "@/types/utils/metadata";
import SelectWithLabel from "@/components/SelectWithLabel";
import ItemRank from "@/components/ItemRank";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import Rank from "@/types/class/Rank";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CSS } from "@dnd-kit/utilities";
import { CirclePlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DialogAddRank from "./DialogAddRank";
import { AddRankFormType } from "./AddRankForm";
import Job from "@/types/class/Job";

export default function Ranks() {
    const { user: currentUser } = useUser();
    const router = useRouter();
    const { setAlert } = useAlert();
    const [ranks, setRanks] = useState<{
        originalRanks: Rank[];
        selectedRanks: Rank[];
    }>({ originalRanks: [], selectedRanks: [] });
    const [jobs, setJobs] = useState<JobType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedJobId, setSelectedJobId] = useState<string>("");
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (!currentUser?.isAdmin) {
            return router.push("/police/dashboard");
        }

        const init = async () => {
            const metadataResponse = await getData(axiosClient.get("/metadata"));
            if (metadataResponse.errorMessage) {
                setAlert({ title: "Erreur", description: metadataResponse.errorMessage });
                return;
            }

            const metaData = metadataResponse.data as MetadataType;
            setJobs(metaData.jobs);

            const selectedJob = metaData.jobs[0];
            setRanks({
                originalRanks: metaData.ranks.map((x) => new Rank(x)),
                selectedRanks: getRanks(metaData.ranks, selectedJob.id!),
            });

            setSelectedJobId(String(selectedJob?.id) || "");
            setIsLoading(false);
        };

        init();
    }, [currentUser, router, setAlert]);

    if (isLoading) return <Loader />;

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!active || !over) return;

        setRanks((prev) => {
            const oldIndex = prev.selectedRanks.findIndex((x) => x.order === active.id);
            const newIndex = prev.selectedRanks.findIndex((x) => x.order === over.id);
            const newOrder = arrayMove(prev.selectedRanks, oldIndex, newIndex);
            return { ...prev, selectedRanks: newOrder };
        });
    }

    function SortableRankItem({ rank }: { rank: Rank }) {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
            id: rank.order!,
        });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <li ref={setNodeRef} style={style}>
                <ItemRank
                    title={`${rank.order}. ${rank.name}`}
                    description={`${rank.userCount} utilisateurs`}
                    className="bg-secondary w-80 px-3 py-1"
                    rankOrder={rank.order!}
                    dragListeners={{ ...listeners, ...attributes }}
                    canUpdate={!!rank.id && rank.id > 0}
                    canDelete={
                        !rank.userCount || isNaN(rank.userCount) || Number(rank.userCount) === 0
                    }
                    onDelete={() =>
                        setRanks((prev) => ({
                            ...prev,
                            selectedRanks: getRanks(
                                prev.selectedRanks.filter((x) => x.order !== rank.order),
                                Number(selectedJobId)
                            ),
                        }))
                    }
                />
            </li>
        );
    }

    return (
        <Page title="Gestion des grades">
            <SelectWithLabel
                label="Filtrer par métier"
                id="job"
                items={jobs.map((x) => ({ value: String(x.id), label: x.name! }))}
                value={selectedJobId}
                onValueChange={(value) => {
                    const newRanks = getRanks(ranks.originalRanks, Number(value));
                    setRanks((prev) => ({
                        ...prev,
                        selectedRanks: newRanks,
                    }));

                    setSelectedJobId(value);
                }}
                className="w-52"
            />

            <div className="mt-3">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={ranks.selectedRanks.map((r) => r.order!)}
                        strategy={verticalListSortingStrategy}
                    >
                        <ul className="grid gap-1">
                            {ranks.selectedRanks.map((rank) => (
                                <SortableRankItem key={rank.order} rank={rank} />
                            ))}
                            <li className="bg-secondary rounded-lg">
                                <Button
                                    variant={"default"}
                                    className="h-full w-full"
                                    onClick={() => setIsDialogOpen(true)}
                                >
                                    <CirclePlus />
                                </Button>
                            </li>
                        </ul>
                    </SortableContext>
                </DndContext>
            </div>
            <ButtonGroup className="mt-3">
                <Button
                    variant={"cancel"}
                    className="w-30"
                    onClick={() => {
                        const newRanks = getRanks(ranks.originalRanks, Number(selectedJobId));
                        setRanks((prev) => ({
                            ...prev,
                            selectedRanks: newRanks,
                        }));
                    }}
                >
                    Annuler
                </Button>
                <Button
                    variant={"ok"}
                    className="w-30"
                    onClick={async () => {
                        const filteredRanks: RankType[] = [];
                        ranks.selectedRanks.forEach((selectedRank, index) => {
                            filteredRanks.push({ ...selectedRank, order: index + 1 });
                        });

                        const newRanksResult = await getData(
                            axiosClient.put("/ranks", filteredRanks)
                        );
                        if (newRanksResult.errorMessage) {
                            setAlert({ title: "Erreur", description: newRanksResult.errorMessage });
                            return;
                        }

                        const newRanks = (newRanksResult.data as RankType[]).map(
                            (x) => new Rank(x)
                        );
                        setRanks({
                            originalRanks: newRanks,
                            selectedRanks: newRanks.filter(
                                (x) => String(x.job?.id) === selectedJobId
                            ),
                        });
                        toast.success("Grades mis à jour");
                    }}
                >
                    Valider
                </Button>
            </ButtonGroup>
            <DialogAddRank
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={(values: AddRankFormType) => {
                    setIsDialogOpen(false);
                    const rankToAdd: RankType = {
                        name: values.name,
                        order: getLastOrder(ranks.selectedRanks) + 1,
                        id: null,
                        job: new Job({ id: Number(selectedJobId), name: null }),
                        userCount: 0,
                    };

                    const newRanks = [...ranks.selectedRanks, new Rank(rankToAdd)];
                    setRanks((prev) => ({
                        originalRanks: prev.originalRanks,
                        selectedRanks: newRanks,
                    }));
                }}
            />
        </Page>
    );
}

function getRanks(originalRanks: RankType[], jobId: number) {
    return originalRanks.filter((x) => x.job?.id === jobId).map((x) => new Rank(x));
}

function getLastOrder(ranks: RankType[]) {
    if (ranks.length === 0) return 0;
    const sorted = [...ranks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return sorted[sorted.length - 1]?.order ?? 0;
}
