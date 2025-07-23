import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ClassModel, type Child } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Tambahkan properti hasil perhitungan ke tipe ClassModel
interface ClassWithStats extends ClassModel {
    total_children: number;
    total_boys: number;
    total_girls: number;
    total_special_needs: number;
    childrens: Child[]; // Pastikan relasi anak ada
}

interface Props {
    class: ClassWithStats;
}

export default function ShowClass({ class: classData }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: route('admin.dashboard') },
        { title: 'Classes', href: route('admin.class.index') },
        { title: 'Details', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Class Details: ${classData.class_name}`} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                {/* Kartu Informasi Utama */}
                <Card>
                    <CardHeader>
                        <CardTitle>{classData.class_name}</CardTitle>
                        <CardDescription>
                            Period: <span className="font-semibold">{classData.period?.name}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Total Children</p>
                            <p className="text-2xl font-bold">{classData.total_children}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Boys</p>
                            <p className="text-2xl font-bold">{classData.total_boys}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Girls</p>
                            <p className="text-2xl font-bold">{classData.total_girls}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Special Needs</p>
                            <p className="text-2xl font-bold">{classData.total_special_needs}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabel Daftar Anak */}
                <Card>
                    <CardHeader>
                        <CardTitle>Children List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Special Needs</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classData.childrens.length > 0 ? (
                                    classData.childrens.map((child) => (
                                        <TableRow key={child.id}>
                                            <TableCell className="font-medium">{child.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={child.is_active ? 'default' : 'secondary'}>
                                                    {child.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {child.special_needs_status ? (
                                                    <div className="flex flex-col">
                                                        <Badge variant="destructive">Yes</Badge>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {child.special_needs_description}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    'No'
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            No children in this class.
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