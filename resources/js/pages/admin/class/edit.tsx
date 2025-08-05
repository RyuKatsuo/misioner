import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ClassModel, type Period } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    class: ClassModel;
    periods: Pick<Period, 'id' | 'name'>[];
}

const breadcrumbs: BreadcrumbItem[] = [
    
    { title: 'Classes', href: route('admin.class.index') },
    { title: 'Edit', href: '#' },
];

export default function EditClass({ class: classData, periods }: Props) {
    const { data, setData, put, errors, processing } = useForm({
        class_name: classData.class_name,
        period_id: classData.period_id,
    });

    const [open, setOpen] = React.useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.class.update', classData.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Class: ${classData.class_name}`} />
            <Card>
                <CardHeader>
                    <CardTitle>Edit Class</CardTitle>
                    <CardDescription>Update the details for the class: {classData.class_name}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="flex max-w-lg flex-col gap-4">
                        <div>
                            <Label htmlFor="class_name">Class Name</Label>
                            <Input
                                id="class_name"
                                type="text"
                                value={data.class_name}
                                onChange={(e) => setData('class_name', e.target.value)}
                                autoFocus
                            />
                            {errors.class_name && <p className="mt-1 text-xs text-red-500">{errors.class_name}</p>}
                        </div>

                        <div>
                            <Label>Period</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between"
                                    >
                                        {data.period_id
                                            ? periods.find((p) => p.id === data.period_id)?.name
                                            : 'Select period...'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search period..." />
                                        <CommandList>
                                            <CommandEmpty>No period found.</CommandEmpty>
                                            <CommandGroup>
                                                {periods.map((period) => (
                                                    <CommandItem
                                                        key={period.id}
                                                        value={period.name}
                                                        onSelect={() => {
                                                            setData('period_id', period.id);
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                data.period_id === period.id ? 'opacity-100' : 'opacity-0',
                                                            )}
                                                        />
                                                        {period.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.period_id && <p className="mt-1 text-xs text-red-500">{errors.period_id}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Class'}
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('admin.class.index')}>Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}