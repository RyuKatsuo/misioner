import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

type NavItem = {
    href: string;
    label: string;
}

interface ManagementLayoutProps {
    children: React.ReactNode;
    navItems: NavItem[];
}

export default function ManagementLayout({ children, navItems }: ManagementLayoutProps) {
    const { url } = usePage();
    console.log('Current URL:', url);
    console.log('items:', navItems);

    return (
        <div className="flex flex-col gap-4 p-4 lg:p-6">
            <div className="flex items-center border-b">
                {navItems.map((item) => {
                    const itemPath = new URL(item.href, window.location.origin).pathname;
                    const currentPath = url.split('?')[0].toLowerCase();

                    const isActive = currentPath.startsWith(itemPath.toLowerCase());
                    console.log(`Checking if active: URL "${url}" starts with "${item.href}":`, isActive);
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                'border-b-2 border-transparent px-4 py-2 text-sm font-medium  transition-colors',
                                'text-muted-foreground hover:text-foreground',
                                isActive && 'border-primary dark:text-white'

                            )}
                        >
                            {item.label}
                        </Link>
                    )
                })}
            </div>
            <div>{children}</div>
        </div>
    );
}