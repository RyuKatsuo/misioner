import AppLayout from '@/layouts/app-layout';
import { type Session, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Props {
    session: Session;
}

export default function EditSession({ session }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        topic: session.topic || '',
        attendances: session.attendances,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        
        { title: 'Sessions', href: route('admin.session.index') },
        { title: 'Edit', href: '#' },
    ];

    const handleStatusChange = (attendanceId: string, newStatus: string) => {
        setData('attendances', data.attendances.map(att => 
            att.id === attendanceId ? { ...att, status: newStatus } : att
        ));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
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
                                {data.attendances.map((att, index) => (
                                    <div key={att.id} className="flex items-center justify-between border p-4 rounded-lg">
                                        <p className="font-medium">{att.child.name}</p>
                                        <Select
                                            value={att.status}
                                            onValueChange={(newStatus) => handleStatusChange(att.id, newStatus)}
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