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
    activeUrlPattern?: string[];
    permission?: string | string[];
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
    is_active: boolean;
    parent?: User;
    gender: string;
    date_of_birth: string;
    school: string;
    hobby: string;
    classModel?: ClassModel;
    total_score: number;
    attendance_count: number;
    graduate?: Graduate;
    is_active: boolean;
    qr_codes?: string;
    avatar_url?: string;
    special_needs_status: boolean;
    special_needs_description?: string;
};

export type Task = {
    id: string;
    task: string;
    description?: string;
    admin_id: string;
    class_id: string;
};

export type Score = {
    id: string;
    score: number;
    task_id: string;
    children_id: string;
    created_at: string;
    updated_at: string;
    task: Task;
};

export type Attendance = {
    id: string;
    session_id: string;
    status: 'Present' | 'Late' | 'Absent' | 'Excused';
    admin_id: string;
    children_id: string;
    created_at: string;
    updated_at: string;
};

export type Session = {
    id: string;
    topic: string | null;
    session_date: string;
    created_at: string;
}

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