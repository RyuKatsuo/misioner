import { Link } from '@inertiajs/react';
import { type Child } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

// Komponen kecil untuk menentukan badge status secara dinamis
function StatusBadge({ child }: { child: Child }) {
    if (child.graduate) {
        return <Badge variant="outline">Graduated</Badge>;
    }
    if (child.is_active) {
        return <Badge variant="default">Active</Badge>;
    }
    return <Badge variant="secondary">Not Active</Badge>;
}

export function ChildCard({ child }: { child: Child }) {
    console.log(child.classModel);
    
    return (
        <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <CardContent className="flex h-full flex-col p-0">
                <div className="flex flex-col items-center p-6 text-center">
                    <Avatar className="mb-4 h-24 w-24 border-2 border-primary/20">
                        {/* Tampilkan gambar dari storage, atau fallback jika null */}
                        <AvatarImage src={child.avatar_url ? `/storage/${child.avatar_url}` : undefined} alt={child.name} />
                        <AvatarFallback className="text-2xl font-bold">
                            {child.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">{child.name}</h3>
                    <p className="text-sm text-muted-foreground">
                        {child.class_model?.class_name ?? 'Not Enrolled in a Class'}
                    </p>
                </div>

                <div className="mt-auto flex items-center justify-between border-t bg-muted/50 p-4">
                    <StatusBadge child={child} />
                    <Button asChild variant="ghost" size="sm">
                        <Link href={route('children.show', child.id)}>
                            Detail
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
