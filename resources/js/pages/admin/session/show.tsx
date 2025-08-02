import AppLayout from '@/layouts/app-layout';
import { type Session, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
    session: Session;
}

export default function ShowSession({ session }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: route('admin.dashboard') },
        { title: 'Sessions', href: route('admin.session.index') },
        { title: 'Details', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Session Details`} />
            <div className="p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Session Details</CardTitle>
                        <CardDescription>
                            {session.class_model.class_name} on {new Date(session.session_date).toLocaleDateString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p><strong>Topic:</strong> {session.topic || 'No topic'}</p>
                        <p><strong>Teacher:</strong> {session.admin.name}</p>
                        <h3 className="font-semibold pt-4">Attendance List</h3>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {session.attendances.map(({ child, status }) => (
                                <div key={child.id} className="border p-4 rounded-lg text-center">
                                    <p className="font-medium">{child.name}</p>
                                    <Badge>{status}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}