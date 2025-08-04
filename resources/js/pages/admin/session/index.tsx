import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedResponse, type Session, type ClassModel } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { getColumns } from './partials/columns';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CreateSessionDialog } from './partials/create-session-dialog';

interface Props {
    sessions: PaginatedResponse<Session>;
    classes: Pick<ClassModel, 'id' | 'class_name'>[];
    filters: { search?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: route('admin.dashboard') },
    { title: 'Sessions', href: route('admin.session.index') },
];

export default function SessionIndex({ sessions, classes, filters }: Props) {
    
    const { auth } = usePage<SharedData>().props;
    const userPermissions = auth.user.permissions;
    
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);
    const memoizedColumns = React.useMemo(() => getColumns({ permissions: userPermissions}), [userPermissions]);
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sessions Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Sessions</h1>
                        <p className="text-muted-foreground">Manage all attendance sessions.</p>
                    </div>

                    {userPermissions.includes('admin.session.create') && (
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Session
                    </Button>
                    )}
                </div>

                <DataTable
                    columns={memoizedColumns}
                    data={sessions}
                    filters={filters}
                    searchRouteName="admin.session.index"
                    searchPlaceholder="Search by class name or topic..."
                />
            </div>

            <CreateSessionDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                classes={classes}
            />
        </AppLayout>
    );
}