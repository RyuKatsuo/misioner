import RegisterAdminForm from '@/components/register-admin-form';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: route('admin.users.index'),
    },
    {
        title: 'Register User',
        href: route('admin.users.create'),
    },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Register Admin" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <RegisterAdminForm />
            </div>
        </AppLayout>
    );
}
