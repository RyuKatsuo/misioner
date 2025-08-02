import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, CheckCircle, XCircle } from 'lucide-react';
import { FormEventHandler, useMemo } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

// Tipe form
type SetPasswordForm = {
    email: string;
    password: string;
    password_confirmation: string;
};

type Admin = {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
};

interface SetPasswordProps {
    admin: Admin;
}

export default function SetPassword({ admin }: SetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<SetPasswordForm>({
        email: admin.email,
        password: '',
        password_confirmation: '',
    });

    const { props } = usePage();
    const status = props.status || props.flash?.status;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('user.password.store', { admin: admin.id,  }), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // validation password rules
    const passwordRules = useMemo(() => {
        const hasUppercase = /[A-Z]/.test(data.password);
        const hasNumber = /[0-9]/.test(data.password);
        const hasSymbol = /[^A-Za-z0-9]/.test(data.password);
        const hasMinLength = data.password.length >= 8;

        return { hasUppercase, hasNumber, hasSymbol, hasMinLength };
    }, [data.password]);

    return (
        <AuthLayout title="Set Your Password" description={`Create a secure password for ${admin.email}.`}>
            <Head title="Set Password" />

            {status && (
                <div className="mb-4 rounded-lg bg-green-100 p-2 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        readOnly
                        className="bg-gray-100 dark:bg-gray-800"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        autoFocus
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">Confirm New Password</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                 <div className="space-y-1 text-sm text-gray-600">
                    <p>Password must contain:</p>
                    <ul className="space-y-1">
                        {[
                            { label: 'At least 8 characters', valid: passwordRules.hasMinLength },
                            { label: 'At least one uppercase letter', valid: passwordRules.hasUppercase },
                            { label: 'At least one number', valid: passwordRules.hasNumber },
                            { label: 'At least one symbol (!@#$%^&*)', valid: passwordRules.hasSymbol },
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                                {item.valid ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                )}
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <Button type="submit" className="mt-4 w-full" disabled={processing}>
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Set Password
                </Button>
            </form>
        </AuthLayout>
    );
}
