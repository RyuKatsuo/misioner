import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import React from 'react';

// Komponen ini akan menerima 'children' sebagai prop.
// 'children' adalah konten spesifik (misal: statistik admin atau statistik user)
// yang ingin Anda tampilkan di dalam layout ini.
type Props = {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {/* Kita akan ganti ini dengan data asli nanti */}
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
            {/* Di sinilah konten spesifik akan ditampilkan */}
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                {children}
            </div>
        </div>
    );
}