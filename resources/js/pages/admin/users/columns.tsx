"use client"

import { type User } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge"

// Tipe props baru untuk meneruskan fungsi dari parent
type ColumnsProps = {
    onDeleteClick: (user: User) => void;
}

type Role = {
    id: number,
    name: string
}


// Fungsi ini sekarang menerima props
export const getColumns = ({ onDeleteClick }: ColumnsProps): ColumnDef<User>[] => [
    {
        accessorKey: "name",
        header: "User Name",
        cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: 'is_active',
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("is_active");

            return (
                <Badge variant={isActive ? "success" : "nonactive"}>
                    {isActive ? "Active" : "Inactive"}
                </Badge>
            )
        }
    },
    {
        accessorKey: "roles",
        header: "Roles",
        cell: ({ row }) => {
            const roles: Role[] = row.original.roles;

            if (!roles || roles.length === 0) {
                return <span className="text-muted-foreground">None</span>
            }

            return (
                <div className="flex flex-wrap gap-1">
                    {roles.map((role, index) => (
                        <span key={role.id} className="capitalize text-sm">
                            <Badge variant={role.name === 'Superadmin' ? "success" : "secondary"}>
                                {role.name}{index < roles.length - 1 ? ',' : ''}
                            </Badge>
                        </span>
                    ))}
                </div>
            );
        }
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
            const user = row.original;


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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                {/* <Link href={route('admin.users.index', user.id)}>Edit User</Link> */}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                disabled={user.is_active}

                            >
                                <Link
                                    href={route('admin.users.send_set_password_link', user.id)}
                                    method="post"
                                    as="button"
                                    className="w-full text-left"
                                >
                                    Send Password Link
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onSelect={() => onDeleteClick(user)} // Panggil fungsi dari parent
                            >
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]
