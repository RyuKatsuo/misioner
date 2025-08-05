import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Task, type Child, type Score } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChildWithScore extends Child {
    scores: Score[];
}
interface TaskWithDetails extends Task {
    class_model: {
        childrens: ChildWithScore[];
    };
}
interface Props {
    task: TaskWithDetails;
}

export default function ShowTask({ task }: Props) {
    const initialScores = task.class_model.childrens.map(child => ({
        child_id: child.id,
        score: child.scores[0]?.score ?? '',
    }));

    const { data, setData, put, processing, errors } = useForm({
        scores: initialScores,
    });

    const [dirty, setDirty] = React.useState(false);

    React.useEffect(() => {
        const updatedScores = task.class_model.childrens.map(child => ({
            child_id: child.id,
            score: child.scores[0]?.score ?? '',
        }));
        setData('scores', updatedScores);
        setDirty(false);
    }, [task]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tasks', href: route('admin.tasks.index') },
        { title: 'Manage Scores', href: '#' },
    ];

    const handleScoreChange = (childId: string, value: string) => {
        setData('scores', data.scores.map(s =>
            s.child_id === childId ? { ...s, score: value } : s
        ));

        setDirty(true);
    };
    
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.tasks.scores.update', task.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Scores for ${task.task}`} />
            <div className="p-4 sm:p-6">
                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{task.task}</CardTitle>
                            <CardDescription>{task.description || 'No description.'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Child Name</TableHead>
                                        <TableHead className="w-[120px]">Score</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {task.class_model.childrens.map((child, index) => (
                                        <TableRow key={child.id}>
                                            <TableCell className="font-medium">{child.name}</TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={data.scores[index]?.score || ''}
                                                    onChange={e => handleScoreChange(child.id, e.target.value)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <div className="mt-6 flex justify-end">
                        <Button type="submit" disabled={processing || !dirty}>
                            {processing ? 'Saving...' : 'Save All Scores'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
