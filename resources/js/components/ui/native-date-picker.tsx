import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

// Komponen ini akan menerima props yang sama seperti input biasa
interface NativeDatePickerProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    [key: string]: any; // Untuk props lainnya seperti 'id'
}

export function NativeDatePicker({ value, onChange, className, ...props }: NativeDatePickerProps) {
    // Buat sebuah ref untuk menghubungkan ke elemen input
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Fungsi ini akan dipanggil saat tombol/tampilan diklik
    const handleButtonClick = () => {
        // Panggil fungsi showPicker() pada input asli
        inputRef.current?.showPicker();
    };

    return (
        <div className="relative">
            {/* Ini adalah tampilan yang dilihat dan diklik oleh pengguna */}
            <Button
                variant={'outline'}
                type="button"
                onClick={handleButtonClick}
                className={cn(
                    'w-full justify-start text-left font-normal',
                    !value && 'text-muted-foreground',
                    className,
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? new Date(value).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    }) : <span>Pilih tanggal</span>}
            </Button>

            {/* Ini adalah input tanggal asli yang kita sembunyikan */}
            {/* Tugasnya hanya untuk menyediakan fungsionalitas kalender */}
            <input
                type="date"
                ref={inputRef}
                value={value}
                onChange={onChange}
                className="absolute left-0 top-0 h-full w-full opacity-0 cursor-pointer"
                {...props}
            />
        </div>
    );
}