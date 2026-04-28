import { type Task } from '@/types';
import { type ColumnDef } from '@tanstack/react-table';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

type ColumnsProps = {
    onDeleteClick: (task: Task) => void;
};

export const getColumns = ({ onDeleteClick }: ColumnsProps): ColumnDef<Task>[] => [
    {
        accessorKey: 'task',
        header: 'Task Name',
    },
    {
        accessorKey: 'class_model.class_name',
        header: 'Class',
    },
    {
        accessorKey: 'admin.name',
        header: 'Teacher',
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            
            const task = row.original;
            return (
                <div className="text-right">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={route('admin.tasks.show', task.id)}>Manage Scores</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={route('admin.tasks.edit', task.id)}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onSelect={() => onDeleteClick(task)}
                            >
                                Delete Task
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
