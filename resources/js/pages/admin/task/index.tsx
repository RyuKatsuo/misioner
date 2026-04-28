import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem, type PaginatedResponse, type Task } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { getColumns } from './partials/columns';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { router } from '@inertiajs/react';

interface Props {
    tasks: PaginatedResponse<Task>;
    filters: {
        search?: string;
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tasks', href: route('admin.tasks.index') },
];

export default function TaskIndex({ tasks, filters }: Props) {
    const { auth } = usePage<SharedData>().props;
    const userPermissions = auth.user.permissions;

    const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);

    const handleDelete = () => {
        if (!taskToDelete) return;
        router.delete(route('admin.tasks.destroy', taskToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setTaskToDelete(null),
        });
    };

    const memoizedColumns = React.useMemo(
        () => getColumns({ onDeleteClick: (task) => setTaskToDelete(task) }),
        []
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Tasks</h1>
                        <p className="text-muted-foreground">Manage all tasks for classes.</p>
                    </div>
                    {userPermissions.includes('admin.task.create') && (
                        <Link href={route('admin.tasks.create')}>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Task
                            </Button>
                        </Link>
                    )}
                </div>
                <DataTable
                    columns={memoizedColumns}
                    data={tasks}
                    filters={filters}
                    searchRouteName="admin.tasks.index"
                    searchPlaceholder="Search by task name or class..."
                />
            </div>

            <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the task "{taskToDelete?.task}" and all associated scores.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
