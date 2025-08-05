import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { type BreadcrumbItem, type ClassModel } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Combobox } from '@/components/ui/combobox';

interface Props {
    classes: Pick<ClassModel, 'id' | 'class_name'>[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tasks', href: route('admin.tasks.index') },
    { title: 'Create', href: route('admin.tasks.create') },
];

export default function CreateTask({ classes }: Props) {
    const { data, setData, post, errors, processing } = useForm({
        task: '',
        description: '',
        class_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.tasks.store'));
    };
    
    const classOptions = classes.map(c => ({ value: c.id, label: c.class_name }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Task" />
            <div className="p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Task</CardTitle>
                        <CardDescription>Fill out the form to create a new task for a class.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6 max-w-lg">
                            <div className="grid gap-2">
                                <Label htmlFor="task">Task Name</Label>
                                <Input id="task" value={data.task} onChange={(e) => setData('task', e.target.value)} autoFocus />
                                <InputError message={errors.task} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                <InputError message={errors.description} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="class_id">Class</Label>
                                <Combobox
                                    options={classOptions}
                                    selectedValue={data.class_id}
                                    onSelect={(value) => setData('class_id', value)}
                                    placeholder="Select a class..."
                                />
                                <InputError message={errors.class_id} />
                            </div>
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Task'}
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={route('admin.tasks.index')}>Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
