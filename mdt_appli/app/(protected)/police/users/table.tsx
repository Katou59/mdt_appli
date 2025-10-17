"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationLink,
    PaginationNext,
} from "@/components/ui/pagination";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isSmall?: boolean;
    pageIndex: number;
    pageSize: number;
    totalPage: number;
    onPageChange: (pageIndex: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    onRowClick: (id: string) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isSmall,
    pageIndex,
    totalPage,
    onPageChange,
    onRowClick,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            <div className="overflow-hidden rounded-md border bg-base-100">
                <Table className={isSmall ? "text-xs" : ""}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-extrabold">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} onClick={() => onRowClick(row.getValue("discordId"))} className="cursor-pointer">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className={isSmall ? "p-1" : ""}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Pas de résultat.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPage > 1 && (
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(pageIndex - 1);
                                }}
                                disabled={pageIndex <= 1}
                            />
                        </PaginationItem>

                        {getPageNumbers(pageIndex, totalPage).map((page, index) => (
                            <PaginationItem key={index}>
                                {page === "..." ? (
                                    <span className="px-3">...</span>
                                ) : (
                                    <PaginationLink
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onPageChange(page as number);
                                        }}
                                        disabled={page === pageIndex}
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(pageIndex + 1);
                                }}
                                disabled={pageIndex === totalPage}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}

function getPageNumbers(current: number, total: number) {
    const pages = [];
    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        if (current <= 4) pages.push(1, 2, 3, 4, 5, "...", total);
        else if (current >= total - 3)
            pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
        else pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
    return pages;
}
