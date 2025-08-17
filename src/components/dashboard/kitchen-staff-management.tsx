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
import { useCreateKitchenStaff, useGetKitchenStaff, useDeleteKitchenStaff } from '@/lib/api/auth-service';
import { useKitchenStaffStorage } from '@/hooks/use-session-storage';
import { extractRestaurantIdFromToken } from '@/lib/utils/jwt-utils';
import type { KitchenStaff } from '@/lib/api/types';

const staffFormSchema = z.object({
  user_name: z.string().min(3, 'Username must be at least 3 characters.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

export function KitchenStaffManagement() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState<KitchenStaff | null>(null);
    
    // Get restaurant ID from JWT token
    const restaurantId = extractRestaurantIdFromToken();
    
    // Session storage for staff list
    const { staffList, addStaff, removeStaff, updateStaffList } = useKitchenStaffStorage();
    
    // API hooks
    const createStaffMutation = useCreateKitchenStaff();
    const deleteStaffMutation = useDeleteKitchenStaff();
    const { data: apiStaffData, isLoading: isLoadingStaff, refetch: refetchStaff } = useGetKitchenStaff(restaurantId);

    // Update session storage when API data changes
    useEffect(() => {
        if (apiStaffData?.staff) {
            updateStaffList(apiStaffData.staff);
        }
    }, [apiStaffData, updateStaffList]);

    // Manual refetch function for when session storage is cleared
    const handleManualRefetch = () => {
        if (restaurantId) {
            refetchStaff();
        }
    };

    const form = useForm<StaffFormValues>({
        resolver: zodResolver(staffFormSchema),
        defaultValues: {
            user_name: '',
            password: '',
        },
    });

    const onSubmit = async (data: StaffFormValues) => {
        if (!restaurantId) {
            toast({
                title: 'Error',
                description: 'Restaurant ID not found. Please log in again.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        
        try {
            const result = await createStaffMutation.mutateAsync({
                user_name: data.user_name,
                password: data.password,
                role: 'kitchen_staff'
            });

            // Add new staff to session storage
            addStaff(result.user);

            toast({
                title: 'Staff Created',
                description: `Login for "${data.user_name}" has been successfully created.`,
            });

            form.reset();
            
            // Refetch staff list to ensure consistency
            refetchStaff();
            
        } catch (error) {
            console.error('Create staff error:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to create staff login.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (staff: KitchenStaff) => {
        setStaffToDelete(staff);
    };

    const handleDeleteConfirm = async () => {
        if (!staffToDelete) return;

        try {
            await deleteStaffMutation.mutateAsync({
                user_id: staffToDelete.id
            });

            // Remove from session storage
            removeStaff(staffToDelete.id);

            toast({
                title: 'Staff Deleted',
                description: `Login for "${staffToDelete.user_name}" has been permanently deleted from the system.`,
            });

            // Refetch staff list to ensure consistency
            refetchStaff();
            
        } catch (error) {
            console.error('Delete staff error:', error);
            toast({
                title: 'Delete Failed',
                description: error instanceof Error ? error.message : 'Failed to delete staff login.',
                variant: 'destructive',
            });
        } finally {
            setStaffToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setStaffToDelete(null);
    };

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
                                    name="user_name"
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
                        <CardDescription className="flex items-center justify-between">
                            <span>A list of all current kitchen staff logins.</span>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleManualRefetch}
                                disabled={isLoadingStaff}
                            >
                                {isLoadingStaff ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Refresh'
                                )}
                            </Button>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingStaff ? (
                            <div className="flex items-center justify-center h-24">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span className="ml-2">Loading staff...</span>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {staffList.length > 0 ? staffList.map((staff) => (
                                        <TableRow key={staff.id}>
                                            <TableCell className="font-medium">{staff.user_name}</TableCell>
                                            <TableCell className="capitalize">{staff.role.replace('_', ' ')}</TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon"
                                                    className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                                                    onClick={() => handleDeleteClick(staff)}
                                                    disabled={deleteStaffMutation.isPending}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                                                No kitchen staff logins found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!staffToDelete} onOpenChange={handleDeleteCancel}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Staff Deletion</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p>
                                You are about to permanently delete the login credentials for staff member{' '}
                                <span className="font-bold text-foreground">{staffToDelete?.user_name}</span>.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                This action will immediately revoke their access to the system. The staff member will no longer be able to log in using these credentials.
                            </p>
                            <p className="text-sm font-medium text-destructive">
                                This action cannot be undone. Please ensure this is the intended action before proceeding.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDeleteCancel}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteStaffMutation.isPending}
                        >
                            {deleteStaffMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Staff Login'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
} 