import AppLayout from '@/layouts/app-layout';
import ManagementLayout from '@/layouts/management-layout';
import { type ClassModel, PaginatedResponse, type BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
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
    { href: route('admin.period.index'), label: 'Periods' },
    { href: route('admin.class.index'), label: 'Classes' },
]

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Classes', href: route('admin.class.index') },
];

export default function ClassIndex({ classes, filters }: Props) {
    const { auth } = usePage<SharedData>().props;
    const userPermissions = auth.user.permissions;

    const [classToDelete, setClassesToDelete] = React.useState<ClassModel | null>(null);

    const handleDelete = () => {
        if (!classToDelete) return;

        router.delete(route('admin.class.destroy', classToDelete.id), {
            preserveScroll: false,
            onSuccess: () => {
                setClassesToDelete(null);
            },
            onError: () => {
                setClassesToDelete(null);
            },
        });
    };

    const columns = React.useMemo(
        () => getColumns({
            permissions: userPermissions,
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
                    {userPermissions.includes('admin.class.create') && (
                        <Link href={route('admin.class.create')}>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Class
                            </Button>
                        </Link>
                    )}
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
                                class. Any children in this class will be unassigned.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </ManagementLayout>
        </AppLayout>
    );
}