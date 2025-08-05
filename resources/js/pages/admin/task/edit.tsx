import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { type BreadcrumbItem, type ClassModel, type Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Combobox } from '@/components/ui/combobox';

interface Props {
    task: Task;
    classes: Pick<ClassModel, 'id' | 'class_name'>[];
}

export default function EditTask({ task, classes }: Props) {
    const { data, setData, put, errors, processing } = useForm({
        task: task.task,
        description: task.description || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tasks', href: route('admin.tasks.index') },
        { title: 'Edit', href: '#' },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.tasks.update', task.id));
    };
    
    const classOptions = classes.map(c => ({ value: c.id, label: c.class_name }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Task: ${task.task}`} />
            <div className="p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Task</CardTitle>
                        <CardDescription>Update the details for the task: {task.task}</CardDescription>
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
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Task'}
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
