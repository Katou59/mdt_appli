import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
    Pagination as PaginationBis,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";
import Pager from "@/types/class/Pager";
import IConverter from "@/types/interfaces/IConverter";

type Props<TEntity extends IConverter<TType>, TType> = {
    pager: Pager<TEntity, TType>;
    onPageChange: (newPage: number) => void;
};

export default function Pagination<TEntity extends IConverter<TType>, TType>({
    pager,
    onPageChange,
}: Props<TEntity, TType>) {
    if (!pager.pageCount || pager.pageCount <= 1) return <></>;

    return (
        <PaginationBis>
            <PaginationContent>
                <PaginationItem>
                    <PaginationLink
                        aria-label="Première page"
                        size="icon"
                        className="rounded-full"
                        disabled={pager.page <= 1}
                        onClick={() => onPageChange(1)}
                    >
                        <ChevronFirstIcon className="h-4 w-4" />
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        aria-label="Page précédente"
                        size="icon"
                        className="rounded-full"
                        disabled={pager.page <= 1}
                        onClick={() => onPageChange(pager.page - 1)}
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <p className="text-muted-foreground text-sm px-3" aria-live="polite">
                        Page {pager.page}/{pager.pageCount}
                    </p>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink
                        aria-label="Page suivante"
                        size="icon"
                        className="rounded-full"
                        disabled={pager.page >= pager.pageCount}
                        onClick={() => onPageChange(pager.page + 1)}
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        aria-label="Dernière page"
                        size="icon"
                        className="rounded-full"
                        disabled={pager.page >= pager.pageCount}
                        onClick={() => onPageChange(pager.pageCount)}
                    >
                        <ChevronLastIcon className="h-4 w-4" />
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </PaginationBis>
    );
}
