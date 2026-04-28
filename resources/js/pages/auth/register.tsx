import * as React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoaderCircle } from 'lucide-react';

import { PageProps, type Community } from '@/types';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';
import TextLink from '@/components/text-link';

// Tipe untuk data form
type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone_number: string;
    gender: string;
    date_of_birth: string;
    community_option: 'listed' | 'outside' | '';
    community_id: string;
    outside_community_address: string;
};

interface RegisterProps extends PageProps {
    communities: Pick<Community, 'id' | 'community_name'>[];
}

export default function Register({ communities }: RegisterProps) {
    const [step, setStep] = React.useState(1);
    const [disableNext, setDisableNext] = React.useState(true);

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone_number: '',
        gender: '',
        date_of_birth: '',
        community_option: '',
        community_id: '',
        outside_community_address: '',
    });

    const step1Fields: (keyof RegisterForm)[] = ['name', 'email', 'password', 'password_confirmation'];
    const step2Fields: (keyof RegisterForm)[] = ['phone_number', 'gender', 'date_of_birth'];

    // Hook untuk validasi step 
    React.useEffect(() => {
        let shouldDisable = true;
        if (step === 1) {
            shouldDisable = step1Fields.some((field) => !data[field]);
        } else if (step === 2) {
            shouldDisable = step2Fields.some((field) => !data[field]);
        } else if (step === 3) {
            if (data.community_option === 'listed') {
                shouldDisable = !data.community_id;
            } else if (data.community_option === 'outside') {
                shouldDisable = !data.outside_community_address;
            } else {
                setDisableNext(true);
            }
        };
        setDisableNext(shouldDisable);
    }, [data, step]);

    // Hook untuk secara otomatis pindah ke step yang error
    React.useEffect(() => {
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            const firstErrorKey = errorKeys[0] as keyof RegisterForm;

            if (step1Fields.includes(firstErrorKey)) {
                setStep(1);
            } else if (step2Fields.includes(firstErrorKey)) {
                setStep(2);
            }
            // Jika error ada di step 3, kita tidak perlu pindah karena sudah di step terakhir
        }
    }, [errors]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const communityOptions = communities.map((c) => ({ value: c.id, label: c.community_name }));

    return (
        <AuthLayout title="Daftar akun orang tua" description="Isi form berikut untuk membuat akun baru">
            <Head title="Register" />
            <form onSubmit={submit} className='flex flex-col gap-6'>
                <Card className='grid gap-6'>
                    <CardHeader>
                        <CardDescription>Step {step} of 3</CardDescription>
                        <Progress value={(step / 3) * 100} className="mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-6 max-w-full">
                        {/* Step 1: Account Credentials */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required autoFocus />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                                    <InputError message={errors.password} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                    <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required />
                                    <InputError message={errors.password} />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Personal Information */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone_number">Nomer Telephone</Label>
                                    <Input id="phone_number" type="tel" value={data.phone_number} onChange={
                                        (e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                setData('phone_number', value);
                                            }
                                        }
                                    } required />
                                    <InputError message={errors.phone_number} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Jenis Kelamin</Label>
                                    <RadioGroup onValueChange={(value) => setData('gender', value)} value={data.gender} className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Male" id="male" />
                                            <Label htmlFor="male">Laki-laki</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Female" id="female" />
                                            <Label htmlFor="female">Perempuan</Label>
                                        </div>
                                    </RadioGroup>
                                    <InputError message={errors.gender} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
                                    <input id="date_of_birth" type="date" value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} onClick={(e) => {
                                        const input = e.currentTarget;
                                        input.showPicker?.();
                                    }} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                    <InputError message={errors.date_of_birth} />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Community Information */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <div className='flex flex-col gap-6'>
                                    <div className='grid gap-2'>
                                        <Label>Lingkungan</Label>
                                        <RadioGroup onValueChange={(value: 'listed' | 'outside') => setData('community_option', value)} value={data.community_option}>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="listed" id="listed" /><Label htmlFor="listed">Saya berasal dari paroki St. Antonius Padua Kotabaru</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="outside" id="outside" /><Label htmlFor="outside">Saya dari luar paroki St. Antonius Padua Kotabaru</Label></div>
                                        </RadioGroup>
                                        <InputError message={errors.community_option} />
                                    </div>

                                    {data.community_option === 'listed' && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="community_id">Pilih Lingkungan</Label>
                                            <Combobox options={communityOptions} selectedValue={data.community_id} onSelect={(value) => setData('community_id', value)} placeholder="Cari lingkungan..." />
                                            <InputError message={errors.community_id} />
                                        </div>
                                    )}
                                    {data.community_option === 'outside' && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="outside_community_address">Nama Lingkungan</Label>
                                            <Textarea id="outside_community_address" value={data.outside_community_address} onChange={(e) => setData('outside_community_address', e.target.value)} />
                                            <InputError message={errors.outside_community_address} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-6 flex items-center justify-between">
                            <div>
                                {step > 1 && <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
                            </div>
                            <div>
                                {step < 3 && <Button type="button" onClick={() => setStep(step + 1)} disabled={disableNext}>
                                    Next
                                </Button>}
                                {step === 3 && (
                                    <Button type="submit" disabled={processing}>
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Account
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="text-center text-sm text-muted-foreground">
                    Sudah punya akun?{' '}
                    <TextLink href={route('login')} tabIndex={5}>
                        Masuk
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
