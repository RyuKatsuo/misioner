import RegisterAdminForm from '@/components/register-admin-form';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    admin?: any;
    roles?: any;
}
export default function Update({ admin, roles }: Props) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: route('admin.users.index'),
        },
        {
            title: 'Update User',
            href: route('admin.users.edit', { admin: admin?.id }),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Admin" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <RegisterAdminForm type='edit' data={admin} roles={roles} />
            </div>
        </AppLayout>
    );
}
