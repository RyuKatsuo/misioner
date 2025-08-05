import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Period, type ClassModel } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Users } from 'lucide-react';

// Perbarui tipe Period di types/index.d.ts untuk menyertakan relasi
interface ClassWithChildrenCount extends ClassModel {
    childrens_count: number;
}

interface PeriodWithDetails extends Period {
    classes: ClassWithChildrenCount[];
}

interface Props {
    period: PeriodWithDetails;
}

export default function ShowPeriod({ period }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        
        { title: 'Periods', href: route('admin.period.index') },
        { title: 'Details', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Period Details: ${period.name}`} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                {/* Kartu Informasi Utama */}
                <Card>
                    <CardHeader>
                        <CardTitle>{period.name}</CardTitle>
                        <CardDescription>
                            Duration: {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={period.is_active ? 'default' : 'destructive'}>
                            {period.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </CardContent>
                </Card>

                {/* Tabel Daftar Kelas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Classes in this Period</CardTitle>
                        <CardDescription>List of all classes registered under {period.name}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Class Name</TableHead>
                                    <TableHead>Total Children</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {period.classes.length > 0 ? (
                                    period.classes.map((classItem) => (
                                        <TableRow key={classItem.id}>
                                            <TableCell className="font-medium">{classItem.class_name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    {classItem.childrens_count}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild variant="secondary" size="sm">
                                                    <a href={route('admin.class.export.attendance', classItem.id)}>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Report
                                                    </a>
                                                </Button>
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={route('admin.class.show', classItem.id)}>
                                                        View Class
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            No classes found in this period.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
