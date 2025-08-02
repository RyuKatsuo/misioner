import * as React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ClassModel } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classes: Pick<ClassModel, 'id' | 'class_name'>[];
}

export function CreateSessionDialog({ open, onOpenChange, classes }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        class_id: '',
        topic: '',
    });
    
    const [popoverOpen, setPopoverOpen] = React.useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.session.store'), {
            onSuccess: () => onOpenChange(false),
        });
    };

    React.useEffect(() => {
        if (!open) reset();
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Session</DialogTitle>
                    <DialogDescription>Select a class to start a new attendance session.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="flex flex-col gap-4 py-4">
                    <div>
                        <Label>Class</Label>
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen} modal={false}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" className="w-full justify-between">
                                    {data.class_id ? classes.find((c) => c.id === data.class_id)?.class_name : 'Select class...'}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="z-[9999] pointer-events-auto w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search class..." />
                                    <CommandList>
                                        <CommandEmpty>No class found.</CommandEmpty>
                                        <CommandGroup>
                                            {classes.map((c) => (
                                                <CommandItem
                                                    key={c.id}
                                                    value={c.class_name}
                                                    onSelect={() => {
                                                        setData('class_id', c.id);
                                                        setPopoverOpen(false);
                                                    }}
                                                >
                                                    <Check className={cn('mr-2 h-4 w-4', data.class_id === c.id ? 'opacity-100' : 'opacity-0')} />
                                                    {c.class_name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.class_id && <p className="mt-1 text-xs text-red-500">{errors.class_id}</p>}
                    </div>
                    <div>
                        <Label htmlFor="topic">Topic (Optional)</Label>
                        <Input
                            id="topic"
                            value={data.topic}
                            onChange={(e) => setData('topic', e.target.value)}
                        />
                        {errors.topic && <p className="mt-1 text-xs text-red-500">{errors.topic}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create & Start Attendance'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}