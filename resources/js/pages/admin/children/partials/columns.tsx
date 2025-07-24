import { type Child } from '@/types';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


type ColumnsProps = {
    onDeleteClick: (classes: Child) => void;
}

export const getColumns = ({ onDeleteClick }: ColumnsProps): ColumnDef<Child>[] => [
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
        id: 'actions',
        cell: ({ row }) => {
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
                            {/* Tambahkan link ke halaman detail/edit nanti */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];