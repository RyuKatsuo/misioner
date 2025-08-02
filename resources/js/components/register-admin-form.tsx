import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

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
    gender: string;
    phone_number: string;
};

type Role = {
    id: string,
    name: string
};

interface RegisterAdminProps extends PageProps {
    roles: Role[];
}

export default function RegisterAdminForm() {
    // Ambil pesan flash dari Inertia
    const { flash, roles } = usePage<RegisterAdminProps>().props;

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        role: '',
        gender: '',
        phone_number: ''
    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => reset(), // Reset semua field setelah berhasil
            preserveScroll: true,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Admin</CardTitle>
                <CardDescription>Enter the details below to create a new admin account.</CardDescription>
            </CardHeader>
            <CardContent>
                {flash.success && <div className="mb-4 rounded bg-green-100 p-4 text-sm text-green-700">{flash.success}</div>}
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Full name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor='phone_number'>Phone Number</Label>
                                <Input
                                    id='phone_number'
                                    type='tel'
                                    required
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    disabled={processing}
                                    placeholder='628xxxxx'
                                />
                                <InputError message={errors.phone_number} className='mt-2'/>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor='gender'>Gender</Label>
                                <Select
                                    onValueChange={(value) => setData('gender', value)}
                                    value={data.gender}
                                    disabled={processing}
                                    required
                                >
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Select a gender"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='Male'>Male</SelectItem>
                                        <SelectItem value='Female'>Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.gender}/>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                onValueChange={ (value) => setData('role', value)}
                                value={data.role}
                                disabled={processing}
                            >
                                <SelectTrigger id='role'>
                                    <SelectValue placeholder="Select a role"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">
                                        <span className='capitalize'>None</span>
                                    </SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.name}>
                                            <span className='capitalize'>{role.name}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role}/>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>
                            {recentlySuccessful && <p className="text-sm text-muted-foreground">Account created successfully.</p>}
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
