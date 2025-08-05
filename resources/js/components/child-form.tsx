import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Tentukan tipe untuk data form agar bisa digunakan kembali
export type ChildFormData = {
    name: string;
    gender: string;
    date_of_birth: string;
    school: string;
    hobby: string;
    avatar: File | null;
    special_needs_status: boolean;
    special_needs_description: string;
};

// Tentukan props untuk komponen form
interface ChildFormProps {
    data: ChildFormData;
    setData: (key: keyof ChildFormData, value: any) => void;
    errors: Partial<Record<keyof ChildFormData, string>>;
    processing: boolean;
    avatarPreview: string | null;
    onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    currentAvatarUrl?: string | null; // Untuk menampilkan avatar yang sudah ada di form edit
}

export function ChildForm({
    data,
    setData,
    errors,
    processing,
    avatarPreview,
    onAvatarChange,
    currentAvatarUrl,
}: ChildFormProps) {
    return (
        <div className="space-y-6">
            {/* Avatar Input & Preview */}
            <div className="space-y-2">
                <Label>Child's Photo</Label>
                <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarPreview || currentAvatarUrl} />
                        <AvatarFallback>{data.name.substring(0, 2).toUpperCase() || '??'}</AvatarFallback>
                    </Avatar>
                    <Input id="avatar" type="file" onChange={onAvatarChange} className="max-w-xs" disabled={processing} />
                </div>
                <InputError message={errors.avatar} />
            </div>

            {/* Name */}
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    disabled={processing}
                />
                <InputError message={errors.name} />
            </div>

            {/* Gender & Date of Birth */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => setData('gender', value)} value={data.gender} disabled={processing}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.gender} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <input
                        id="date_of_birth"
                        type="date"
                        value={data.date_of_birth}
                        onChange={(e) => setData('date_of_birth', e.target.value)}
                        onClick={(e) => {
                            const input = e.currentTarget;
                            input.showPicker?.();
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        disabled={processing}
                    />
                    <InputError message={errors.date_of_birth} />
                </div>
            </div>

            {/* School & Hobby */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="school">School</Label>
                    <Input
                        id="school"
                        value={data.school}
                        onChange={(e) => setData('school', e.target.value)}
                        disabled={processing}
                    />
                    <InputError message={errors.school} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="hobby">Hobby</Label>
                    <Input id="hobby" value={data.hobby} onChange={(e) => setData('hobby', e.target.value)} disabled={processing} />
                    <InputError message={errors.hobby} />
                </div>
            </div>

            {/* Special Needs */}
            <div className="space-y-4 rounded-md border p-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="special_needs_status"
                        checked={data.special_needs_status}
                        onCheckedChange={(checked) => setData('special_needs_status', !!checked)}
                        disabled={processing}
                    />
                    <Label htmlFor="special_needs_status">This child has special needs</Label>
                </div>
                {data.special_needs_status && (
                    <div className="grid gap-2">
                        <Label htmlFor="special_needs_description">Description of Needs</Label>
                        <Textarea
                            id="special_needs_description"
                            value={data.special_needs_description}
                            onChange={(e) => setData('special_needs_description', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.special_needs_description} />
                    </div>
                )}
            </div>
        </div>
    );
}
