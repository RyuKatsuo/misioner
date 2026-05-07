import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChildForm, ChildFormData } from '@/components/child-form'; // Impor komponen & tipe
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'My Children', href: route('children.index') },
    { title: 'Add Child', href: route('children.create') },
];

export default function CreateChild() {
    const { data, setData, post, errors, processing, progress } = useForm<ChildFormData>({
        name: '',
        gender: '',
        date_of_birth: '',
        school: '',
        hobby: '',
        avatar: null,
        special_needs_status: false,
        special_needs_description: '',
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
        post(route('children.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Child" />
            <div className="p-4 sm:p-6">
                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Add a New Child</CardTitle>
                            <CardDescription>Fill out the form below to register your child.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChildForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                avatarPreview={avatarPreview}
                                onAvatarChange={handleAvatarChange}
                            />
                            {/* {progress && (
                                <progress value={progress.percentage} max="100" className="w-full mt-4">
                                    {progress.percentage}%
                                </progress>
                            )} */}
                        </CardContent>
                    </Card>
                    <div className="mt-6 flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Child'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route('children.index')}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
