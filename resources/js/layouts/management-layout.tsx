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

    return (
        <div className="flex flex-col gap-4 p-4 lg:p-6">
            <div className="flex items-center border-b">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            'border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                            url.startsWith(item.href.split('?')[0]) && 'border-primary text-primary',
                        )}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
            <div>{children}</div>
        </div>
    );
}