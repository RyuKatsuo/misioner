import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { type Child, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ChildCard } from '@/components/child-card'; // Impor komponen baru

interface Props {
    children: Child[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: route('dashboard') },
    { title: 'My Children', href: route('children.index') },
];

export default function ChildrenIndex({ children }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Children" />

            <div className="p-4 sm:p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">My Children</h1>
                        <p className="text-muted-foreground">Here is a list of your registered children.</p>
                    </div>
                    <Link href={route('children.create')}>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Child
                        </Button>
                    </Link>
                </div>

                {children.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        
                        {children.map((child) => (
                            <ChildCard key={child.id} child={child} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                        <h3 className="text-xl font-semibold">No Children Found</h3>
                        <p className="mt-2 text-muted-foreground">You haven't added any children yet. Click the button to get started.</p>
                        <Link href={route('children.create')} className="mt-4">
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Your First Child
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
