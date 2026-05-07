import { type Session } from '@/types';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

type ColumnsProps = {
    permissions: string[];
}

export const getColumns = ({ permissions }: ColumnsProps): ColumnDef<Session>[] => [
    {
        accessorKey: 'class_model.class_name',
        header: 'Class',
    },
    {
        accessorKey: 'admin.name',
        header: 'Created By',
    },
    {
        accessorKey: 'topic',
        header: 'Topic',
        cell: ({ row }) => row.original.topic || '-',
    },
    {
        accessorKey: 'session_date',
        header: 'Date',
        cell: ({ row }) => new Date(row.original.session_date).toLocaleDateString(),
    },
    {
        accessorKey: 'created_at',
        header: 'Time', // Ganti header menjadi 'Time'
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            // Gunakan toLocaleTimeString dengan opsi
            return date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // Menggunakan format 24 jam
            });
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const session = row.original;
            return (
                <div className="text-right">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">

                            {permissions.includes('admin.session.attendance') && (
                                <DropdownMenuItem asChild>
                                    <Link href={route('admin.attendances.show', session.id)}>Take Attendance</Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                                <Link href={route('admin.session.show', session.id)}>Detail</Link>
                            </DropdownMenuItem>
                            {/* {permissions.includes('admin.session.edit') && (
                                <DropdownMenuItem asChild>
                                    <Link href={route('admin.session.edit', session.id)}>Update Status</Link>
                                </DropdownMenuItem>
                            )} */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];