import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ClassModel, type Child } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, MoreVertical, PlusCircle } from 'lucide-react';
import * as React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


// Tambahkan properti hasil perhitungan ke tipe ClassModel
interface ClassWithStats extends ClassModel {
    total_children: number;
    total_boys: number;
    total_girls: number;
    total_special_needs: number;
    attendance_count: number;
    total_score: number;
    childrens: Child[];
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

    const [childToUnenroll, setChildToUnenroll] = React.useState<Child | null>(null)
    const [childToUngraduate, setChildToUngraduate] = React.useState<Child | null>(null)

    const handleUnenroll = () => {
        if (!childToUnenroll) return

        router.delete(route('admin.class.unenroll', { class: classData.id, child: childToUnenroll.id }), {
            preserveScroll: true,
            onSuccess: () => setChildToUnenroll(null),
            onError: () => setChildToUnenroll(null)
        });
    }

    const handleUngraduate = () => {
        if(!childToUngraduate) return

        router.delete(route('admin.class.ungraduate', {child: childToUngraduate.id}), {
            preserveScroll: true,
            onSuccess: () => setChildToUngraduate(null),
            onError: () => setChildToUngraduate(null)
        });
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Class Details: ${classData.class_name}`} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                {/* Kartu Informasi Utama */}
                <Card>
                    <CardHeader>
                        {/* Perbaikan 2: Struktur CardHeader yang lebih baik */}
                        <div className="flex items-center justify-between">
                            <CardTitle>{classData.class_name}</CardTitle>
                            <DropdownMenu modal={false}>
                                {/* Perbaikan 3: Tambahkan prop 'asChild' */}
                                <DropdownMenuTrigger asChild>
                                    <Button className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <Link href={route('admin.class.graduate.form', classData.id)}>Graduate Child</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
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
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Children List</CardTitle>
                            <CardDescription>List of children enrolled in this class.</CardDescription>
                        </div>
                        <Link href={route('admin.class.enroll.form', classData.id)}>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Enroll Child
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Total Attendance</TableHead>
                                    <TableHead>Total Score</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Special Needs</TableHead>
                                    <TableHead className='text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classData.childrens.length > 0 ? (
                                    classData.childrens.map((child) => (
                                        // console.log(child);

                                        <TableRow key={child.id}>
                                            <TableCell className="font-medium">{child.name}</TableCell>
                                            <TableCell>
                                                <p>{child.attendance_count}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p>{child.total_score}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p>{child.gender}</p>
                                            </TableCell>
                                            <TableCell>
                                                {child.graduate ? (
                                                    <Badge variant="outline">Graduated</Badge>
                                                ) : (
                                                    <Badge variant={child.is_active ? 'default' : 'secondary'}>
                                                        {child.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                )}
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
                                            <TableCell className='text-right'>
                                                <DropdownMenu modal={false}>
                                                    <DropdownMenuTrigger>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onSelect={() => setChildToUngraduate(child)}
                                                            disabled={!child.graduate}
                                                        >
                                                            Remove Graduate Status
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator/>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onSelect={() => setChildToUnenroll(child)}
                                                        >
                                                            Remove from Class
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
            <AlertDialog open={!!childToUnenroll} onOpenChange={(open) => !open && setChildToUnenroll(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove <span className="font-semibold text-foreground">{childToUnenroll?.name}</span> from the class and set their status to Inactive. This action does not delete the child's data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUnenroll} className="bg-red-600 hover:bg-red-700">
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <AlertDialog open={!!childToUngraduate} onOpenChange={(open) => !open && setChildToUngraduate(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will change <span className="font-semibold text-foreground">{childToUngraduate?.name}</span> graduate status. This action does not delete the child's data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUngraduate} className="bg-red-600 hover:bg-red-700">
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}