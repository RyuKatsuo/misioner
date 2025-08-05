import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ClassModel, type Child } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Props {
    class: ClassModel;
    availableChildren: (Pick<Child, 'id' | 'name' | 'special_needs_status' | 'special_needs_description' | 'gender'> & { parent?: { name: string } })[];
    filters: { search?: string };
}

export default function EnrollChild({ class: classData, availableChildren, filters }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        children_ids: [] as string[],
    });

    const [searchTerm, setSearchTerm] = React.useState(filters.search || '');

    const breadcrumbs: BreadcrumbItem[] = [
        
        { title: 'Classes', href: route('admin.class.index') },
        { title: 'Details', href: route('admin.class.show', classData.id) },
        { title: 'Enroll', href: '#' },
    ];

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(route('admin.class.enroll.form', classData.id), { search: searchTerm }, {
                    preserveState: true,
                    replace: true,
                });
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchTerm, classData.id, filters.search]);

    const handleCheckboxChange = (childId: string, checked: boolean) => {
        setData(
            'children_ids',
            checked
                ? [...data.children_ids, childId]
                : data.children_ids.filter((id) => id !== childId),
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.class.enroll.store', classData.id), {
            onSuccess: () => setData('children_ids', []),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Enroll Children to ${classData.class_name}`} />
            <Card>
                <CardHeader>
                    <CardTitle>Enroll Children to {classData.class_name}</CardTitle>
                    <CardDescription>Select children from the list to enroll them into this class.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <Input
                            placeholder="Search available children by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <ScrollArea className="h-72 w-full rounded-md border">
                            <div className="p-4">
                                {availableChildren.length > 0 ? (
                                    availableChildren.map((child) => (
                                        <div key={child.id} className="flex items-center space-x-2 py-2">
                                            <Checkbox
                                                id={child.id}
                                                onCheckedChange={(checked) => handleCheckboxChange(child.id, !!checked)}
                                                checked={data.children_ids.includes(child.id)}
                                            />
                                            <label htmlFor={child.id} className="text-sm font-medium leading-none cursor-pointer">
                                                {child.name}
                                                <span className="text-xs text-muted-foreground"> (Gender: {child.gender}) </span>
                                                <span className="text-xs text-muted-foreground"> (Parent: {child.parent?.name ?? 'N/A'}) </span>
                                                <span className="text-xs text-red-200"> {child.special_needs_status ? "Special : " + child.special_needs_description : ""} </span>
                                                
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-center text-muted-foreground">No available children found.</p>
                                )}
                            </div>
                        </ScrollArea>
                        {errors.children_ids && <p className="text-xs text-red-500">{errors.children_ids}</p>}

                        <div className="flex items-center gap-2">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type="button" disabled={processing || data.children_ids.length === 0}>
                                        Enroll {data.children_ids.length > 0 && `(${data.children_ids.length})`}{' '}
                                        Children
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will enroll {data.children_ids.length} children into the class "{classData.class_name}" and set their status to Active.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={submit}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <Button variant="outline" asChild>
                                <Link href={route('admin.class.show', classData.id)}>Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}