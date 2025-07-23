import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Period } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
    period: Period;
    hasOtherActivePeriod: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: route('admin.dashboard') },
    { title: 'Periods', href: route('admin.period.index') },
    { title: 'Edit', href: '#' },
];

export default function EditPeriod({ period, hasOtherActivePeriod }: Props) {
    const { data, setData, put, errors, processing } = useForm({
        name: period.name,
        start_date: period.start_date,
        end_date: period.end_date,
        is_active: period.is_active,
    });

    const [isSaveDisabled, setIsSaveDisabled] = React.useState(false);

    React.useEffect(() => {
        if (hasOtherActivePeriod && data.is_active) {
            setIsSaveDisabled(true);
        } else {
            setIsSaveDisabled(false);
        }
    }, [data.is_active, hasOtherActivePeriod]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.period.update', period.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Period: ${period.name}`} />
            <Card>
                <CardHeader>
                    <CardTitle>Edit Period</CardTitle>
                    <CardDescription>Update the details for the period: {period.name}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="name">Period Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoFocus
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    onClick={(e) => {
                                        const input = e.currentTarget;
                                        input.showPicker?.();
                                    }}
                                />
                                {errors.start_date && <p className="mt-1 text-xs text-red-500">{errors.start_date}</p>}
                            </div>
                            <div>
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    onClick={(e) => {
                                        const input = e.currentTarget;
                                        input.showPicker?.();
                                    }}
                                />
                                {errors.end_date && <p className="mt-1 text-xs text-red-500">{errors.end_date}</p>}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', !!checked)}
                            />
                            <Label htmlFor="is_active">Set as active period</Label>
                        </div>
                        {isSaveDisabled && (
                            <p className="text-sm text-yellow-600">
                                You cannot activate this period because another one is already active.
                            </p>
                        )}
                        <div className="flex items-center gap-2">
                            <Button type="submit" disabled={processing || isSaveDisabled}>
                                {processing ? 'Updating...' : 'Update Period'}
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('admin.period.index')}>Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}