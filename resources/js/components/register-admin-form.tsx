import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageProps } from '@/types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';

type RegisterForm = {
    name: string;
    email: string;
    role: string;
    roles?: string[];
    gender: string;
    phone_number: string;
};

type Role = {
    id: string;
    name: string;
};

interface RegisterAdminProps extends PageProps {
    roles: Role[];
    type: 'create' | 'edit';
    data?: RegisterForm & { id: number };
}

export default function RegisterAdminForm({ type, data, roles }: RegisterAdminProps) {
    const { flash } = usePage<PageProps>().props;
    console.log('Roles in RegisterAdminForm:', roles);
    console.log('Data in RegisterAdminForm:', data?.roles?.[0]?.name);

    const { 
        data: formData, 
        setData, 
        post, 
        put, 
        processing, 
        errors, 
        reset, 
        recentlySuccessful 
    } = useForm<RegisterForm>({
        name: data?.name || '',
        email: data?.email || '',
        role: data?.roles?.[0]?.name || '',
        gender: data?.gender || '',
        phone_number: data?.phone_number || ''
    });

    useEffect(() => {
        if (data && type === 'edit') {
            setData({
                name: data.name,
                email: data.email,
                role: data.roles?.[0]?.name || '',
                gender: data.gender,
                phone_number: data.phone_number,
            });
        }
    }, [data, type]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (type === 'create') {
            post(route('admin.users.store'), {
                onSuccess: () => reset(),
                preserveScroll: true,
            });
        } else {
            if (data?.id) {
                put(route('admin.users.update', data.id), {
                    preserveScroll: true,
                });
            }
        }
    };

    const isCreate = type === 'create';

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isCreate ? 'Create New Admin' : 'Edit Admin Account'}</CardTitle>
                <CardDescription>
                    {isCreate 
                        ? 'Enter the details below to create a new admin account.' 
                        : 'Update the admin account details below.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Flash Message */}
                {flash.success && (
                    <div className="mb-4 rounded bg-green-100 p-4 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        {/* Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus={isCreate}
                                value={formData.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Full name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Phone */}
                            <div className="grid gap-2">
                                <Label htmlFor="phone_number">Phone Number</Label>
                                <Input
                                    id="phone_number"
                                    type="tel"
                                    required
                                    value={formData.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    disabled={processing}
                                    placeholder="628xxxxx"
                                />
                                <InputError message={errors.phone_number} />
                            </div>

                            {/* Gender */}
                            <div className="grid gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    onValueChange={(value) => setData('gender', value)}
                                    value={formData.gender}
                                    disabled={processing}
                                    required
                                >
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Select a gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.gender} />
                            </div>
                        </div>

                        {/* Role */ }
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                onValueChange={(value) => setData('role', value)}
                                value={formData.role || undefined}
                                disabled={processing}
                            >
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.name}>
                                            <span className="capitalize">{role.name}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {isCreate ? 'Create Account' : 'Update Account'}
                            </Button>
                            {recentlySuccessful && (
                                <p className="text-sm text-muted-foreground">
                                    Saved successfully.
                                </p>
                            )}
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}