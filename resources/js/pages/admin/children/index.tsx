import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedResponse, type Child } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/data-table';
import { getColumns } from './partials/columns';
import * as React from 'react';

interface Props {
    childrens: PaginatedResponse<Child>;
    filters: { search?: string; status?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: route('admin.dashboard') },
    { title: 'Children', href: route('admin.children.index') },
];

export default function ChildrenIndex({ childrens: childrens, filters }: Props) {
    const handleTabChange = (status: string) => {
        router.get(route('admin.children.index'), { status }, {
            preserveState: true,
            replace: true,
        });
    };

    const [childrenToDelete, setChildrenToDelete] = React.useState<Child | null>(null);
    const handleDelete = () => {
        if (!childrenToDelete) return;

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
    

    const memoizedColumns = React.useMemo(
        () => getColumns({
            onDeleteClick: (childrens) => setChildrenToDelete(childrens),
            pageStatus: filters.status || 'active'
        }), []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Children Management" />

            <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
                <h1 className="text-2xl font-semibold">Children</h1>
                <Tabs defaultValue={filters.status || 'active'} onValueChange={handleTabChange}>
                    <TabsList>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="inactive">Inactive</TabsTrigger>
                        <TabsTrigger value="graduated">Graduated</TabsTrigger>
                    </TabsList>
                </Tabs>

                <DataTable
                    columns={memoizedColumns}
                    data={childrens}
                    filters={filters}
                    searchRouteName="admin.children.index"
                    searchPlaceholder="Search by child or parent name..."
                />
            </div>
        </AppLayout>
    );
}