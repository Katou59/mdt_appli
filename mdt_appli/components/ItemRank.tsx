import React, { useState } from "react";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemMedia,
    ItemTitle,
} from "./ui/item";
import { Button } from "./ui/button";
import { MoreHorizontalIcon, GripVertical } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
    header?: string;
    footer?: string;
    title?: string;
    description?: string;
    className?: string;
    rankOrder: number;
    onEdit?: () => void;
    onDelete?: () => void;
    dragListeners?: unknown;
};

export default function ItemRank({
    rankOrder,
    description,
    footer,
    header,
    title,
    className,
    onEdit,
    onDelete,
    dragListeners,
}: Props) {
    return (
        <Item className={className}>
            <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Drag handle"
                {...(dragListeners || {})}
            >
                <GripVertical />
            </Button>
            {header && <ItemHeader>{header}</ItemHeader>}
            <ItemContent>
                {title && <ItemTitle>{title}</ItemTitle>}
                {description && <ItemDescription>{description}</ItemDescription>}
            </ItemContent>
            <ItemActions>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" aria-label="Open menu" size="icon-sm">
                            <MoreHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40" align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuItem onSelect={() => console.log("caca")}>
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => {
                                    console.log("cacacacacacacacacacac");
                                }}
                            >
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </ItemActions>
            {footer && <ItemFooter>{footer}</ItemFooter>}
        </Item>
    );
}
