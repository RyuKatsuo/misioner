"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { router } from '@inertiajs/react'
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PaginatedResponse } from "@/types"

// Props dibuat lebih generik untuk bisa digunakan kembali
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: PaginatedResponse<TData>
    filters: {
        search?: string
    }
    searchRouteName: string // Prop baru untuk menentukan rute pencarian
    searchPlaceholder?: string // Prop opsional untuk placeholder input
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filters,
    searchRouteName,
    searchPlaceholder = "Filter items...", // Placeholder default
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data: data.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    // State untuk debounce input pencarian
    const [searchValue, setSearchValue] = React.useState(filters.search || '');

    // Efek untuk menjalankan pencarian setelah pengguna berhenti mengetik
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            // Hanya kirim request jika nilai pencarian berubah
            if (searchValue !== (filters.search || '')) {
                router.get(route(searchRouteName), { 
                    search: searchValue,
                    status: filters.status
                 }, {
                    preserveState: true,
                    replace: true,
                });
            }
        }, 500); // Penundaan 500ms

        return () => clearTimeout(timeout);
    }, [searchValue, searchRouteName, filters.search]);

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={(row.original as any).id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Showing {data.from} to {data.to} of {data.total} items.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.get(data.prev_page_url!)}
                        disabled={!data.prev_page_url}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.get(data.next_page_url!)}
                        disabled={!data.next_page_url}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
