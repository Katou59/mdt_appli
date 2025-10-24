import React from "react";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemTitle,
} from "./ui/item";
import { Button } from "./ui/button";
import { MoreHorizontalIcon, GripVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    canDelete?: boolean;
    canUpdate?: boolean;
};

export default function ItemRank({
    description,
    footer,
    header,
    title,
    className,
    onDelete,
    dragListeners,
    canDelete,
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
            {canDelete === true && (
                <ItemActions>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" aria-label="Open menu" size="icon-sm">
                                <MoreHorizontalIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40" align="end">
                            <DropdownMenuGroup>
                                {/* {canUpdate && (
                                    <DropdownMenuItem onSelect={() => onEdit?.()}>
                                        Modifier
                                    </DropdownMenuItem>
                                )} */}
                                {canDelete && (
                                    <DropdownMenuItem
                                        variant="destructive"
                                        onSelect={() => {
                                            onDelete?.();
                                        }}
                                    >
                                        Supprimer
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ItemActions>
            )}
            {footer && <ItemFooter>{footer}</ItemFooter>}
        </Item>
    );
}
