"use client"

import { type ClassModel } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";


type ColumnsProps = {
    onDeleteClick: (classes: ClassModel) => void;
    permissions: any[];
}



// Fungsi ini sekarang menerima props
export const getColumns = ({ onDeleteClick, permissions }: ColumnsProps): ColumnDef<ClassModel>[] => [
    {
        accessorKey: "class_name",
        header: "Class Name",
        cell: ({ row }) => <div className="capitalize">{row.getValue("class_name")}</div>,
    },
    {
        accessorKey: "period.name",
        header: "Period"
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
            const classes = row.original;
            const canEdit = permissions.includes('admin.class.edit');
            const canDelete = permissions.includes('admin.class.delete');


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
                                    <Link href={route('admin.class.edit', classes.id)}>Edit</Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                                <Link href={route('admin.class.show', classes.id)}>Detail</Link>
                            </DropdownMenuItem>
                            {canDelete && (
                                <DropdownMenuItem
                                    asChild
                                    className="text-red-600 focus:text-red-600"
                                    onSelect={() => onDeleteClick(classes)}
                                >
                                    Delete class
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]
