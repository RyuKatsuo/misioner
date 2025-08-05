import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import { ClassModel, type BreadcrumbItem, type Child } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Props {
    childrenToGraduate: (Pick<Child, 'id' | 'name'> & { parent?: { name: string } })[];
    filters: { search?: string };
    class: ClassModel 
}

export default function GraduateChild({ childrenToGraduate, filters, class: classData }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        children_ids: [] as string[],
    });

    const [searchTerm, setSearchTerm] = React.useState(filters.search || '');

    const breadcrumbs: BreadcrumbItem[] = [
        
        { title: 'Children', href: route('admin.children.index') },
        { title: 'Graduate', href: '#' },
    ];

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            
            if (searchTerm !== (filters.search || '')) {
                router.get(route('admin.class.graduate.form', classData.id), { search: searchTerm }, {
                    preserveState: true,
                    replace: true,
                });
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchTerm, filters.search]);

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
        post(route('admin.class.graduate.store', classData.id), {
            onSuccess: () => setData('children_ids', []),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Graduate Children" />
            <Card>
                <CardHeader>
                    <CardTitle>Graduate Children</CardTitle>
                    <CardDescription>Select active children from the list to graduate them.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <Input
                            placeholder="Search active children by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <ScrollArea className="h-72 w-full rounded-md border">
                            <div className="p-4">
                                {childrenToGraduate.length > 0 ? (
                                    childrenToGraduate.map((child) => (
                                        <div key={child.id} className="flex items-center space-x-2 py-2">
                                            <Checkbox
                                                id={child.id}
                                                onCheckedChange={(checked) => handleCheckboxChange(child.id, !!checked)}
                                                checked={data.children_ids.includes(child.id)}
                                            />
                                            <label htmlFor={child.id} className="text-sm font-medium leading-none cursor-pointer">
                                                {child.name} 
                                                <span className="text-xs text-muted-foreground"> (Parent: {child.parent?.name ?? 'N/A'})</span>
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-center text-muted-foreground">No active children found to graduate.</p>
                                )}
                            </div>
                        </ScrollArea>
                        {errors.children_ids && <p className="text-xs text-red-500">{errors.children_ids}</p>}

                        <div className="flex items-center gap-2">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type="button" disabled={processing || data.children_ids.length === 0}>
                                        Graduate {data.children_ids.length > 0 && `(${data.children_ids.length})`}{' '}
                                        Children
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will graduate {data.children_ids.length} children. Their status will become Graduated, and they will be removed from their class.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={submit} className="bg-destructive hover:bg-destructive/90">Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button variant="outline" asChild>
                                <Link href={route('admin.children.index')}>Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}