import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';
import * as React from 'react';




export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    

    const dashboardRoute = auth.guard === 'admin' ? route('admin.dashboard') : route('dashboard');

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardRoute,
            icon: LayoutGrid,
            activeUrlPattern: ['admin.dashboard'],
        },
        {
            title: 'My Children',
            href: route('children.index'),
            icon: LayoutGrid,
            activeUrlPattern: ['children.index'],
        },
        {
            title: 'Management Period & Class',
            href: route('admin.period.index'),
            icon: LayoutGrid,
            activeUrlPattern: ['admin.period.*', 'admin.class.*'],
            permission: ['admin.period.view_list', 'admin.class.view_list'],
        },
        {
            title: 'Management Childrens',
            href: route('admin.children.index'),
            icon: LayoutGrid,
            activeUrlPattern: ['admin.children.*'],
            permission: 'admin.children.view_list',
        },
        {
            title: 'Management Admin',
            href: route('admin.users.index'),
            icon: LayoutGrid,
            activeUrlPattern: ['admin.users.*'],
            permission: 'admin.user.view_list',
        },
        {
            title: 'Management Sessions',
            href: route('admin.session.index'),
            icon: LayoutGrid,
            activeUrlPattern: ['admin.session.*', 'admin.attendance.*'],
            permission: 'admin.session.view_list',
        },
    ];

    // Filter mainNavItems berdasarkan permission user
    const userPermissions = auth.user.permissions;
    const filteredNavItems = React.useMemo(() => {
        return mainNavItems.filter((item) => {
            // Jika item tidak butuh permission, selalu tampilkan
            if (!item.permission) {
                return true;
            }

            // Jika butuh banyak permission (array)
            if (Array.isArray(item.permission)) {
                // Pastikan user punya SEMUA permission yang dibutuhkan
                return item.permission.every(p => userPermissions.includes(p));
            }

            // Jika hanya butuh satu permission (string)
            return userPermissions.includes(item.permission);
        });
    }, [userPermissions]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
