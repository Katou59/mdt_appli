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

    useEffect(() => {
        if (!currentUser?.isAdmin) {
            return router.push("/police/dashboard");
        }

        const init = async () => {
            console.log("init");
            const metadataResponse = await getData(axiosClient.get("/metadata"));
            if (metadataResponse.errorMessage) {
                setAlert({ title: "Erreur", description: metadataResponse.errorMessage });
                return;
            }

            const metaData = metadataResponse.data as MetadataType;
            setJobs(metaData.jobs);

            const selectedJob = metaData.jobs[0];
            const selectedRanks = metaData
                .ranks!.filter((x) => String(x.job!.id!) === selectedJobId!)
                .map((x) => new Rank(x));

            setRanks({
                originalRanks: metaData.ranks.map((x) => new Rank(x)),
                selectedRanks: selectedRanks,
            });

            setSelectedJobId(String(selectedJob?.id) || "");
            setIsLoading(false);
        };

        init();
    }, [currentUser, router, selectedJobId, setAlert]);

    if (isLoading) <Loader />;

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
                onValueChange={(value) => setSelectedJobId(value)}
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
                        </ul>
                    </SortableContext>
                </DndContext>
            </div>
            <ButtonGroup className="mt-3">
                <Button
                    variant={"cancel"}
                    className="w-30"
                    onClick={() => {
                        setRanks((prev) => ({
                            ...prev,
                            selectedRanks: prev.originalRanks.filter(
                                (x) => String(x.job!.id!) === selectedJobId
                            ),
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
                            selectedRanks: newRanks,
                        });
                        toast.success("Grades mis à jour");
                    }}
                >
                    Valider
                </Button>
            </ButtonGroup>
        </Page>
    );
}
