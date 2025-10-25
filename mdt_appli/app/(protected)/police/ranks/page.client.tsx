"use client";

import Alert from "@/components/alert";
import ItemRank from "@/components/item-rank";
import Loader from "@/components/loader";
import Page from "@/components/page";
import SelectWithLabel from "@/components/select-label";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import axiosClient, { getData } from "@/lib/axios-client";
import { useAlert } from "@/lib/Contexts/alert-context";
import { useMetadata } from "@/lib/Contexts/metadata-context";
import Job from "@/types/class/Job";
import Rank from "@/types/class/Rank";
import { RankType } from "@/types/db/rank";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DialogAddRank from "./dialog-add-rank";
import { AddRankFormType } from "./form-add-rank";

export default function RanksClient() {
    const { setAlert } = useAlert();
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedJobId, setSelectedJobId] = useState<number>(0);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { metadata, refresh: refreshMetadata } = useMetadata();

    useEffect(() => {
        if (!metadata) return;

        let selectedJobIdValue = selectedJobId;
        if (!selectedJobIdValue) {
            selectedJobIdValue = metadata.jobs[0].id ?? 0;
        }

        setRanks(
            metadata.ranks.filter((x) => x.job?.id === selectedJobIdValue).map((x) => new Rank(x))
        );

        setSelectedJobId(selectedJobIdValue);
        setIsLoading(false);
    }, [metadata, selectedJobId]);

    if (!metadata && !isLoading) return <Alert />;

    if (isLoading) return <Loader />;

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!active || !over) return;

        const oldIndex = ranks.findIndex((x) => x.order === active.id);
        const newIndex = ranks.findIndex((x) => x.order === over.id);
        const newOrder = arrayMove(ranks, oldIndex!, newIndex!);

        setRanks(newOrder.map((x) => new Rank(x)));
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
                        setRanks(
                            ranks?.filter((x) => x.order !== rank.order).map((x) => new Rank(x)) ??
                                []
                        )
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
                items={metadata?.jobs.map((x) => ({ value: String(x.id), label: x.name! })) || []}
                value={String(selectedJobId)}
                onValueChange={(value) => {
                    const newRanks = getRanks(metadata?.ranks || [], Number(value));
                    setRanks(newRanks);

                    setSelectedJobId(Number(value));
                }}
                className="w-52"
            />

            <div className="mt-3">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={ranks.map((r) => r.order!)}
                        strategy={verticalListSortingStrategy}>
                        <ul className="grid gap-1">
                            {ranks.map((rank) => (
                                <SortableRankItem key={rank.order} rank={rank} />
                            ))}
                            <li className="bg-secondary rounded-lg">
                                <Button
                                    variant={"default"}
                                    className="h-full w-full"
                                    onClick={() => setIsDialogOpen(true)}>
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
                        const newRanks = getRanks(metadata?.ranks || [], Number(selectedJobId));
                        setRanks(newRanks);
                    }}>
                    Annuler
                </Button>
                <Button
                    variant={"ok"}
                    className="w-30"
                    onClick={async () => {
                        const filteredRanks: RankType[] = [];
                        ranks.forEach((selectedRank, index) => {
                            filteredRanks.push({ ...selectedRank, order: index + 1 });
                        });

                        const newRanksResult = await getData(
                            axiosClient.put("/ranks", filteredRanks)
                        );
                        if (newRanksResult.errorMessage) {
                            setAlert({ title: "Erreur", description: newRanksResult.errorMessage });
                            return;
                        }

                        await refreshMetadata();
                        const newRanks = (metadata?.ranks as RankType[]).map((x) => new Rank(x));
                        setRanks(newRanks.filter((x) => x.job?.id === selectedJobId));
                        toast.success("Grades mis à jour");
                    }}>
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
                        order: getLastOrder(ranks) + 1,
                        id: null,
                        job: new Job({ id: Number(selectedJobId), name: null }),
                        userCount: 0,
                    };

                    const newRanks = [...ranks, new Rank(rankToAdd)];
                    setRanks(newRanks);
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
