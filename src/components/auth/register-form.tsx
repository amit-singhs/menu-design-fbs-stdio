'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

// State for which step we are on
type Step = 'details' | 'otp';

const registerFormSchema = z.object({
  restaurantName: z.string().min(2, 'Restaurant name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  mobile: z.string().min(10, 'Please enter a valid mobile number.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // path of error
});

const otpFormSchema = z.object({
    otp: z.string().min(6, {
        message: 'Your one-time password must be 6 characters.',
    }),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<Step>('details');
  const [registrationData, setRegistrationData] = useState<RegisterFormValues | null>(null);

  const detailsForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      restaurantName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
        otp: '',
    },
  });

  const onDetailsSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    console.log('Registration Data:', data);
    
    // Simulate API call to send OTP
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setRegistrationData(data);
    setStep('otp');

    toast({
      title: 'OTP Sent!',
      description: `We've sent a verification code to ${data.mobile}.`,
    });
    
    setIsSubmitting(false);
  };
  
  const onOtpSubmit = async (data: z.infer<typeof otpFormSchema>) => {
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.otp === '111111') {
        toast({
            title: 'Verification Successful!',
            description: 'Your account has been created. Redirecting...',
        });
        // In a real app, you would now complete the registration on the backend.
        router.push('/');
    } else {
        otpForm.setError("otp", {
            type: "manual",
            message: "The code you entered is incorrect. Please try again.",
        });
    }
    
    setIsSubmitting(false);
  }

  if (step === 'otp') {
    return (
        <div className='text-center'>
            <div className="flex flex-col items-center text-center mb-8">
                <div className="p-3 bg-primary rounded-full text-primary-foreground mb-4">
                    <UtensilsCrossed className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold font-headline">Verify Your Number</h1>
                <p className="text-muted-foreground">
                    Enter the 6-digit code sent to {registrationData?.mobile}.
                </p>
            </div>
            <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6" suppressHydrationWarning>
                    <FormField
                        control={otpForm.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">One-Time Password</FormLabel>
                                <FormControl>
                                    <div className='flex justify-center'>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify & Create Account
                    </Button>
                    <Button variant="link" size="sm" onClick={() => setStep('details')}>
                        Go back
                    </Button>
                </form>
            </Form>
        </div>
    );
  }

  return (
    <>
        <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 bg-primary rounded-full text-primary-foreground mb-4">
                <UtensilsCrossed className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold font-headline">Create an Account</h1>
            <p className="text-muted-foreground">
                Tell us a bit about your restaurant to get started.
            </p>
        </div>
        <Form {...detailsForm}>
        <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} className="space-y-4" suppressHydrationWarning>
            <FormField
            control={detailsForm.control}
            name="restaurantName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Restaurant Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Bella Vista" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={detailsForm.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="your.email@restaurant.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={detailsForm.control}
            name="mobile"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., (123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={detailsForm.control}
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
            <FormField
            control={detailsForm.control}
            name="confirmPassword"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={detailsForm.control}
                name="terms"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-2">
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                        I agree to the <Link href="#" className="underline">Terms and Conditions</Link>
                        </FormLabel>
                    </div>
                    <FormMessage className="!mt-0" />
                    </FormItem>
                )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register
            </Button>
        </form>
        </Form>
    </>
  );
}
