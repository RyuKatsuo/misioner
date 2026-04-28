"use client"

import { type Period } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";


type ColumnsProps = {
    onDeleteClick: (period: Period) => void;
    permissions: string[];
}



// Fungsi ini sekarang menerima props
export const getColumns = ({ onDeleteClick, permissions }: ColumnsProps): ColumnDef<Period>[] => [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
        accessorKey: 'start_date',
        header: 'Start Date',
        cell: ({ row }) => new Date(row.original.start_date).toLocaleDateString(),
    },
    {
        accessorKey: 'end_date',
        header: 'End Date',
        cell: ({ row }) => new Date(row.original.end_date).toLocaleDateString(),
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={row.original.is_active ? 'default' : 'destructive'}>
                {row.original.is_active ? 'Active' : 'Inactive'}
            </Badge>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"));
            return <div>{date.toLocaleDateString()}</div>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const period = row.original;
            // console.log(user);
            const canEdit = permissions.includes('admin.period.edit');
            const canDelete = permissions.includes('admin.period.delete');

            return (
                <div className="text-right">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {canEdit && (
                                <DropdownMenuItem asChild>
                                    <Link href={route('admin.period.edit', period.id)}>Edit</Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                                <Link href={route('admin.period.show', period.id)}>Detail</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {canDelete && (
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onSelect={() => onDeleteClick(period)}
                                    asChild
                                >
                                    Delete Period
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]
