import AppLayout from '@/layouts/app-layout';
import ManagementLayout from '@/layouts/management-layout';
import { type ClassModel, PaginatedResponse, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { DataTable } from '@/components/data-table'; // Impor DataTable generik
import { getColumns } from './partials/columns'; // Impor definisi kolom
import * as React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface Props {
    classes: PaginatedResponse<ClassModel>;
    filters: { search?: string };
}

const managementNavItem = [
    {href: route('admin.period.index'), label: 'Periods'},
    {href: route('admin.class.index'), label: 'Classes'},
]

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Classes', href: route('admin.class.index') },
];

export default function ClassIndex({ classes, filters }: Props) {
    const [classToDelete, setClassesToDelete] = React.useState<ClassModel | null>(null);

    const handleDelete = () => {
        if (!classToDelete) return;

        // router.delete(route('admin.period.destroy', periodToDelete.id), {
        //     preserveScroll: false,
        //     onSuccess: () => {
        //         setPeriodToDelete(null);
        //     },
        //     onError: () => {
        //         setPeriodToDelete(null);
        //     },
        // });
    };

    const columns = React.useMemo(
        () => getColumns({
            onDeleteClick: (classes) => setClassesToDelete(classes)
        }),
        []
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classes" />
            <ManagementLayout navItems={managementNavItem}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Classes</h1>
                        <p className="text-muted-foreground">Manage all Classes in the system.</p>
                    </div>
                    <Link href={route('admin.class.create')}>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Class
                        </Button>
                    </Link>
                </div>
                <DataTable
                    columns={columns}
                    data={classes}
                    filters={filters}
                    searchRouteName="admin.class.index"
                    searchPlaceholder="Filter by Name or Period..."
                />

                <AlertDialog open={!!classToDelete} onOpenChange={(open) => !open && setClassesToDelete(null)}>
                    <AlertDialogContent forceMount>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                <span className="font-semibold text-foreground"> {classToDelete?.class_name} </span>
                                role. Any users with this role will lose their assigned permissions.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Continue
                                </button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </ManagementLayout>
        </AppLayout>
    );
}