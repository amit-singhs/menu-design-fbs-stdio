'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2, UserPlus, Users } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const staffFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

type KitchenStaff = StaffFormValues & { id: string };

export default function KitchenStaffPage() {
    const { toast } = useToast();
    const [staffList, setStaffList] = useState<KitchenStaff[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load staff from localStorage on component mount
    useEffect(() => {
        try {
            const storedStaff = window.localStorage.getItem('kitchenStaff');
            if (storedStaff) {
                setStaffList(JSON.parse(storedStaff));
            }
        } catch (error) {
            console.error("Could not parse kitchen staff from localStorage", error);
        }
    }, []);

    const form = useForm<StaffFormValues>({
        resolver: zodResolver(staffFormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = (data: StaffFormValues) => {
        setIsSubmitting(true);
        
        // Check for duplicate username
        if (staffList.some(staff => staff.username.toLowerCase() === data.username.toLowerCase())) {
            form.setError('username', { type: 'manual', message: 'This username is already taken.' });
            setIsSubmitting(false);
            return;
        }

        const newStaff: KitchenStaff = {
            id: `staff-${Date.now()}`,
            ...data,
        };

        const updatedList = [...staffList, newStaff];
        setStaffList(updatedList);
        window.localStorage.setItem('kitchenStaff', JSON.stringify(updatedList));

        toast({
            title: 'Staff Created',
            description: `Login for "${data.username}" has been successfully created.`,
        });

        form.reset();
        setIsSubmitting(false);
    };

    const handleDelete = (staffId: string) => {
        const updatedList = staffList.filter(staff => staff.id !== staffId);
        setStaffList(updatedList);
        window.localStorage.setItem('kitchenStaff', JSON.stringify(updatedList));
        toast({
            title: 'Staff Deleted',
            description: 'The staff login has been removed.',
            variant: 'destructive'
        });
    }

    return (
        <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
                    Kitchen Staff Management
                </h1>
            </div>
            <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-6 w-6" /> Create New Login
                        </CardTitle>
                        <CardDescription>Add a new username and password for a kitchen staff member.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., chef_john" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                    )}
                                    Create Login
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-6 w-6" /> Existing Staff
                        </CardTitle>
                        <CardDescription>A list of all current kitchen staff logins.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Username</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staffList.length > 0 ? staffList.map((staff) => (
                                    <TableRow key={staff.id}>
                                        <TableCell className="font-medium">{staff.username}</TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon">
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the login for <span className="font-bold">{staff.username}</span>.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(staff.id)}>
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-muted-foreground h-24">
                                            No kitchen staff logins created yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
