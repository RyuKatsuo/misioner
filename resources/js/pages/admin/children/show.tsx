import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Child, type Attendance, type Score } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Perbarui tipe Child di types/index.d.ts untuk menyertakan relasi ini
interface ChildWithDetails extends Child {
    attendances: Attendance[];
    scores: (Score & { task: { task: string } })[];
}

interface Props {
    child: ChildWithDetails;
}

export default function ShowChild({ child }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: route('admin.dashboard') },
        { title: 'Children', href: route('admin.children.index') },
        { title: 'Details', href: '#' },
    ];

    return (
        
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Child Details: ${child.name}`} />

            <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-3">
                {/* Kolom Kiri: Informasi Utama */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{child.name}</CardTitle>
                            <CardDescription>
                                Parent: <span className="font-semibold">{child.parent?.name ?? 'N/A'}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><strong>Class:</strong> {child?.class_model?.class_name ?? 'Not Enrolled'}</p>
                            <p><strong>Period:</strong> {child?.class_model?.period?.name ?? 'N/A'}</p>
                            <p><strong>Gender:</strong> {child.gender}</p>
                            <p><strong>Date of Birth:</strong> {new Date(child.date_of_birth).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> <Badge variant={child.is_active ? 'default' : 'secondary'}>{child.is_active ? 'Active' : 'Inactive'}</Badge></p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border p-4 text-center">
                                <p className="text-sm text-muted-foreground">Attendance</p>
                                <p className="text-2xl font-bold">{child.attendance_count}</p>
                            </div>
                            <div className="rounded-lg border p-4 text-center">
                                <p className="text-sm text-muted-foreground">Total Score</p>
                                <p className="text-2xl font-bold">{child.total_score}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Kolom Kanan: Riwayat Kehadiran dan Tugas */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {child.attendances.length > 0 ? (
                                        child.attendances.map((att) => (
                                            <TableRow key={att.id}>
                                                <TableCell>{new Date(att.created_at).toLocaleString()}</TableCell>
                                                <TableCell>{att.status}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={2} className="h-24 text-center">No attendance records.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Task Scores</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Task Name</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {child.scores.length > 0 ? (
                                        child.scores.map((score) => (
                                            <TableRow key={score.id}>
                                                <TableCell>{score.task.task}</TableCell>
                                                <TableCell>{score.score}</TableCell>
                                                <TableCell>{new Date(score.created_at).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center">No score records.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}