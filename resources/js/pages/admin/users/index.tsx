import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, PaginatedResponse, type User, type BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { getColumns } from './columns';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RadixToast } from '@/components/radix-toast';

interface IndexUsersProps extends PageProps {
    users: PaginatedResponse<User>;
    filters: {
        search?: string;
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: route('admin.users.index') },
];

export default function Index({ users, filters }: IndexUsersProps) {
    const { auth } = usePage<SharedData>().props;
    const userPermissions = auth.user.permissions;

    // --- State untuk dialog sekarang ada di sini ---
    const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
    const { flash } = usePage<PageProps & { flash: { success?: string } }>().props;
    const flashTimer = React.useRef<NodeJS.Timeout | null>(null);

    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');


    React.useEffect(() => {
        if (flash.success) {
            setMessage(flash.success);
            setOpen(true);

            flashTimer.current = setTimeout(() => {
                setOpen(false);
            }, 3000);
        }

        return () => {
            if (flashTimer.current) clearTimeout(flashTimer.current);
        };
    }, [flash.success]);


    // Fungsi untuk menangani penghapusan
    const handleDelete = () => {
        if (!userToDelete) return;

        router.delete(route('admin.users.destroy', userToDelete.id), {
            preserveScroll: false,
            onSuccess: () => {
                setUserToDelete(null);
            },
            onError: () => {
                setUserToDelete(null);
            },
        });
    };

    const columns = React.useMemo(
        () => getColumns({
            onDeleteClick: (user) => setUserToDelete(user),
            permissions: userPermissions,
        }),
        []
    );



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Management" />

            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <RadixToast
                    open={open}
                    onOpenChange={setOpen}
                    title="Success"
                    message={message}
                    variant="success" // atau "error"
                />

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Admin</h1>
                        <p className="text-muted-foreground">Manage all admin in the system.</p>
                    </div>

                    {userPermissions.includes('admin.user.create') && (
                        <Link href={route('admin.users.create')}>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Admin
                            </Button>
                        </Link>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={users}
                    filters={filters}
                    searchRouteName="admin.users.index"
                    searchPlaceholder="Filter by user name or email..."
                />
            </div>

            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent forceMount>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            <span className="font-semibold text-foreground"> {userToDelete?.name} </span>
                            user will be deleted.
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
        </AppLayout>
    );
}
