
'use client';

import { useMemo, useState, type SVGProps } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, CheckCircle2, PartyPopper, SmilePlus, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Order } from '@/context/order-context';
import { FeedbackForm } from '@/components/feedback-form';

const orderStatuses = [
  { name: 'Approved', icon: CheckCircle2, description: "Your order is confirmed." },
  { name: 'Preparing', icon: ChefHat, description: "The kitchen is crafting your meal." },
  { name: 'Ready', icon: PartyPopper, description: "Your order is ready! Enjoy!" },
];

interface OrderStatusProps {
  order: Order;
  onBackToMenu: () => void;
}

export function OrderStatus({ order, onBackToMenu }: OrderStatusProps) {
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    
    const currentStatusIndex = useMemo(() => {
        switch(order.status) {
            case 'placed': return 0;
            case 'preparing': return 1;
            case 'ready': return 2;
            default: return 0;
        }
    }, [order.status]);

    const isComplete = currentStatusIndex === orderStatuses.length - 1;
    
    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 animate-in fade-in duration-500">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-0" />
            <Card className="w-full max-w-md rounded-2xl shadow-2xl bg-card/80 backdrop-blur-sm z-10">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl sm:text-4xl font-bold text-primary">
                        Order Status
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Table #{order.tableNumber}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                    {!isComplete ? (
                        <div className="relative">
                            {/* Connecting Lines */}
                            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border -z-10" />

                            {orderStatuses.map((status, index) => {
                                const isActive = index <= currentStatusIndex;
                                return (
                                    <div key={status.name} className="flex items-start gap-4 relative mb-8 last:mb-0">
                                        <div className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-500",
                                            isActive ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-muted-foreground"
                                        )}>
                                        <status.icon className="h-5 w-5" />
                                        </div>
                                        <div className="pt-1.5">
                                            <p className={cn(
                                                "font-bold text-lg transition-colors duration-500",
                                                isActive ? "text-foreground" : "text-muted-foreground"
                                            )}>{status.name}</p>
                                            <p className="text-sm text-muted-foreground">{isActive && status.description}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : !feedbackSubmitted ? (
                        <FeedbackForm orderId={order.id} onFeedbackSubmitted={() => setFeedbackSubmitted(true)} />
                    ) : (
                        <div className="text-center py-8 space-y-4 animate-in fade-in duration-500">
                            <SmilePlus className="h-16 w-16 text-green-500 mx-auto" />
                            <h3 className="text-2xl font-bold">Thank You!</h3>
                            <p className="text-muted-foreground">Your feedback has been received. We hope to see you again soon!</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4 p-6">
                    <Button
                        size="lg"
                        className="w-full h-12 text-base"
                        onClick={onBackToMenu}
                    >
                         <Utensils className="mr-2 h-5 w-5"/>
                        {isComplete ? 'Place Another Order' : 'Back to Menu'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
