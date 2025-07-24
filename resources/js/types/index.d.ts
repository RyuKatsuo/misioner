import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    is_active?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type Period = {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
};

export type ClassModel = {
    id: string;
    period_id: string;
    class_name: string;
    period?: Period; // Relasi (opsional)
};

export type Graduate = {
    id: string;
    children_id: string;
    graduated_at: string;
};

export type Child = {
    id: string;
    name: string;
    active: boolean;
    parent?: User;
    gender: string;
    classModel?: ClassModel;
    graduate?: Graduate; // <-- Tambahkan ini
    is_active: boolean;
    special_needs_status: boolean;
    special_needs_description?: string;
};

export type PaginatedResponse<T> = {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
    // Laravel 11/12 paginator menyertakan ini di level atas
    first_page_url: string;
    last_page_url: string;
    prev_page_url: string | null;
    next_page_url: string | null;
    from: number;
    to: number;
    total: number;
};