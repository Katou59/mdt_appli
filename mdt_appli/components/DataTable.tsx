"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Pager from "@/types/class/Pager";
import IConverter from "@/types/interfaces/IConverter";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import Pagination from "./pagination";

interface DataTableProps<TEntity extends IConverter<TType>, TType, TData, TValue> {
    pager: Pager<TEntity, TType>;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isSmall?: boolean;
    onPageChange: (pageIndex: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    onRowClick: (id: string) => void;
    keyIndex: keyof TData;
    columnsToHide?: (keyof TData)[];
}

export function DataTable<TEntity extends IConverter<TType>, TType, TData, TValue>({
    columns,
    data,
    isSmall,
    onPageChange,
    onRowClick,
    keyIndex,
    columnsToHide,
    pager,
}: DataTableProps<TEntity, TType, TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            columnVisibility: Object.fromEntries((columnsToHide ?? []).map((key) => [key, false])),
        },
    });

    return (
        <div className="w-full grid gap-5">
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
                                <TableRow
                                    key={row.id}
                                    onClick={() => onRowClick(row.getValue(String(keyIndex)))}
                                    className="cursor-pointer">
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
            <Pagination onPageChange={onPageChange} pager={pager} />
        </div>
    );
}
