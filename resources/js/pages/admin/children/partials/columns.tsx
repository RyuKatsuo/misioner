import { type Child } from '@/types';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';


type ColumnsProps = {
    onDeleteClick: (child: Child) => void;
    onUngraduateClick: (child: Child) => void;
    pageStatus: string;
}

export const getColumns = ({ onDeleteClick, onUngraduateClick, pageStatus }: ColumnsProps): ColumnDef<Child>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'parent.name',
        header: 'Parent',
    },
    {
        accessorKey: 'class_model.class_name',
        header: 'Class',
        cell: ({ row }) =>
            // console.log(row.original);

            row.original?.class_model?.class_name ?? 'N/A'
    },
    {
        header: 'Status',
        cell: ({ row }) => {
            const child = row.original;
            if (child.graduate) {
                return <Badge variant="outline">Graduated</Badge>;
            }
            return (
                <Badge variant={child.is_active ? 'default' : 'secondary'}>
                    {child.is_active ? 'Active' : 'Inactive'}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'special_needs_status',
        header: 'Special Needs',
        cell: ({ row }) => {
            const child = row.original;
            return (
                child.special_needs_status ? (
                    <div className="flex flex-col">
                        <Badge variant="destructive">Yes</Badge>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {child.special_needs_description}
                        </p>
                    </div>
                ) : (
                    'No'
                )
            )
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const child = row.original;
            return (
                <div className="text-right">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                                <Link href={route('admin.children.show', child.id)}>Detail Children</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {pageStatus === 'graduated' && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600"
                                        onSelect={() => onUngraduateClick(child)}
                                    >
                                        Remove Graduate Status
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];