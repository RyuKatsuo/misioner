import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChildForm, ChildFormData } from '@/components/child-form'; // Impor komponen & tipe
import { type BreadcrumbItem, type Child } from '@/types';

interface Props {
    child: Child;
}

export default function EditChild({ child }: Props) {
    const { data, setData, errors, processing, progress } = useForm<ChildFormData & { _method?: string }>({
        name: child.name,
        gender: child.gender,
        date_of_birth: child.date_of_birth,
        school: child.school,
        hobby: child.hobby,
        avatar: null,
        special_needs_status: child.special_needs_status,
        special_needs_description: child.special_needs_description || '',
        _method: 'PUT', // Trik untuk memberitahu Laravel ini adalah request PUT/PATCH
    });

    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Gunakan router.post untuk mengirim form dengan file
        router.post(route('admin.children.update', child.id), data);
    };
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Children', href: route('admin.children.index') },
        { title: 'Details', href: route('children.show', child.id) },
        { title: 'Edit', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${child.name}`} />
            <div className="p-4 sm:p-6">
                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Child: {child.name}</CardTitle>
                            <CardDescription>Update the child's information below.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChildForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                avatarPreview={avatarPreview}
                                onAvatarChange={handleAvatarChange}
                                currentAvatarUrl={child.avatar_url ? `/storage/${child.avatar_url}` : undefined}
                            />
                            {progress && (
                                <progress value={progress.percentage} max="100" className="w-full mt-4">
                                    {progress.percentage}%
                                </progress>
                            )}
                        </CardContent>
                    </Card>
                    <div className="mt-6 flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Child'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route('children.show', child.id)}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
