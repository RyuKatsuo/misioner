import AppLayout from '@/layouts/app-layout';
import { type Session, type BreadcrumbItem, type Child } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

// Tipe data baru yang kita terima dari controller
interface AttendanceData {
    id: string | null;
    child_id: string;
    child_name: string;
    status: string;
}

interface Props {
    session: Session;
    attendance_data: AttendanceData[];
}

export default function EditSession({ session, attendance_data }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        topic: session.topic || '',
        // Siapkan payload yang bersih untuk dikirim ke backend
        attendances: attendance_data.map(att => ({
            child_id: att.child_id,
            status: att.status,
        })),
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Sessions', href: route('admin.session.index') },
        { title: 'Edit', href: '#' },
    ];

    // Fungsi ini sekarang menggunakan child_id yang selalu ada
    const handleStatusChange = (childId: string, newStatus: string) => {
        setData('attendances', data.attendances.map(att =>
            att.child_id === childId ? { ...att, status: newStatus } : att
        ));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Payload 'data.attendances' sekarang sudah cocok dengan logika updateOrCreate di backend
        put(route('admin.session.update', session.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Session" />
            <div className="p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Update Session</CardTitle>
                        <CardDescription>Update topic and attendance status for {session.class_model.class_name}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <Label htmlFor="topic">Topic</Label>
                                <Input
                                    id="topic"
                                    value={data.topic}
                                    onChange={(e) => setData('topic', e.target.value)}
                                />
                            </div>
                            <div className="space-y-4">
                                {/* Loop menggunakan data lengkap dari prop */}
                                {attendance_data.map((att) => (
                                    // Gunakan child_id sebagai key yang unik dan stabil
                                    <div key={att.child_id} className="flex items-center justify-between border p-4 rounded-lg">
                                        <p className="font-medium">{att.child_name}</p>
                                        <Select
                                            // Ambil nilai status dari state form yang bisa berubah
                                            value={data.attendances.find(a => a.child_id === att.child_id)?.status}
                                            onValueChange={(newStatus) => handleStatusChange(att.child_id, newStatus)}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Present">Present</SelectItem>
                                                <SelectItem value="Late">Late</SelectItem>
                                                <SelectItem value="Absent">Absent</SelectItem>
                                                <SelectItem value="Excused">Excused</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={route('admin.session.index')}>Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}