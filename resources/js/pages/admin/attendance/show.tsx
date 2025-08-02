import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Session, type Child, type Attendance } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import * as React from 'react';
import { RadixToast } from '@/components/radix-toast';

// Pastikan tipe ini sudah ada di types/index.d.ts
interface SessionWithDetails extends Session {
    class_model: {
        id: string;
        class_name: string;
        period: { name: string };
    };
    attendances: (Attendance & { child: Child })[];
}

interface Props {
    session: SessionWithDetails;
}

interface CustomPageProps extends PageProps {
    flash: {
        success?: string;
        error?: string;
    };
}

export default function ShowAttendance({ session }: Props) {
    const { data, setData, post, errors, processing, reset } = useForm({
        qr_code: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: route('admin.dashboard') },
        { title: 'Sessions', href: route('admin.session.index') },
        { title: 'Attendance', href: '#' },
    ];

    const inputRef = React.useRef<HTMLInputElement>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.attendances.check-in', session.id), {
            onFinish: () => reset('qr_code'),
            preserveScroll: true,
        });
    };

    // Efek untuk fokus kembali ke input setelah submit berhasil
    React.useEffect(() => {
        inputRef.current?.focus();
    }, [session]); // Dijalankan setiap kali data sesi diperbarui

    //toast message

    const { flash } = usePage<CustomPageProps>().props;
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [toastVariant, setToastVariant] = React.useState<'success' | 'error'>('success');


    React.useEffect(() => {
        let flashMessage = flash.success || flash.error;
        let variant: 'success' | 'error' = flash.success ? 'success' : 'error';

        if (flashMessage) {
            setMessage(flashMessage);
            setToastVariant(variant);
            setOpen(true);

            const timer = setTimeout(() => setOpen(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    //end toast message

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Attendance for ${session.class_model.class_name}`} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <RadixToast
                    open={open}
                    onOpenChange={setOpen}
                    title={toastVariant === 'success' ? "Success" : "Failed"}
                    message={message}
                    variant={toastVariant}
                />

                {/* Form Input QR Code */}
                <Card>
                    <CardHeader>
                        <CardTitle>Scan QR Code</CardTitle>
                        <CardDescription>Use a QR scanner or manually type the code below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex items-start gap-4">
                            <div className="flex-1">
                                <Input
                                    ref={inputRef}
                                    id="qr_code"
                                    type="text"
                                    value={data.qr_code}
                                    onChange={(e) => setData('qr_code', e.target.value.toUpperCase())}
                                    placeholder="Enter QR Code..."
                                    className="text-lg"
                                />
                                {errors.qr_code && <p className="mt-1 text-xs text-red-500">{errors.qr_code}</p>}
                            </div>
                            <Button type="submit" disabled={processing} className="py-6">
                                {processing ? 'Checking...' : 'Check In'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Daftar Kehadiran */}
                <Card>
                    <CardHeader>
                        <CardTitle>({session.class_model.class_name}) Attendance List</CardTitle>
                        <CardDescription>
                            {session.topic && <span>Topic: {session.topic} | </span>}
                            Session Date: {new Date(session.session_date).toLocaleDateString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {session.attendances.map(({ child, status }) => (
                                <div key={child.id} className="flex flex-col items-center gap-2 rounded-lg border p-4">
                                    <p className="font-semibold text-center">{child.name}</p>
                                    <Badge
                                        className={
                                            status === 'Present' ? 'bg-green-500' :
                                                status === 'Late' ? 'bg-yellow-500' : 'bg-gray-500'
                                        }
                                    >
                                        {status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}