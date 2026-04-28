import AppLayout from '@/layouts/app-layout';
import ManagementLayout from '@/layouts/management-layout';
import { PaginatedResponse, SharedData, type BreadcrumbItem, type Period } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/data-table'; // Impor DataTable generik
import { getColumns } from './partials/columns'; // Impor definisi kolom
import * as React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface Props {
    periods: PaginatedResponse<Period>;
    filters: { search?: string };
}

const managementNavItem = [
    { href: route('admin.period.index'), label: 'Periods' },
    { href: route('admin.class.index'), label: 'Classes' },
]

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Periods', href: route('admin.period.index') },
];

export default function PeriodIndex({ periods, filters }: Props) {
    const { auth } = usePage<SharedData>().props;
    const userPermissions = auth.user.permissions;

    const [periodToDelete, setPeriodToDelete] = React.useState<Period | null>(null);

    const handleDelete = () => {
        if (!periodToDelete) return;

        router.delete(route('admin.period.destroy', periodToDelete.id), {
            preserveScroll: false,
            onSuccess: () => {
                setPeriodToDelete(null);
            },
            onError: () => {
                setPeriodToDelete(null);
            },
        });
    };

    const columns = React.useMemo(
        () => getColumns({
            permissions: userPermissions,
            onDeleteClick: (user) => setPeriodToDelete(user)
        }),
        []
    );


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Periods" />
            <ManagementLayout navItems={managementNavItem}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Periods</h1>
                        <p className="text-muted-foreground">Manage all Periods in the system.</p>
                    </div>
                    {userPermissions.includes('admin.period.create') && (
                        <Link href={route('admin.period.create')}>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Period
                            </Button>
                        </Link>
                    )}
                </div>
                <DataTable
                    columns={columns}
                    data={periods}
                    filters={filters}
                    searchRouteName="admin.period.index"
                    searchPlaceholder="Filter by Name..."
                />

                <AlertDialog open={!!periodToDelete} onOpenChange={(open) => !open && setPeriodToDelete(null)}>
                    <AlertDialogContent forceMount>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                <span className="font-semibold text-foreground"> {periodToDelete?.name} </span>
                                role. Any users with this role will lose their assigned permissions.
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