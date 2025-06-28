'use client';

import type { z } from 'zod';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { Utensils, ShoppingCart, Plus, Minus, Trash2, Loader2 } from 'lucide-react';
import type { menuItemSchema } from '@/components/menu-form';
import { cn } from '@/lib/utils';

type MenuItem = z.infer<typeof menuItemSchema>;
type CartItem = MenuItem & { quantity: number };

interface MenuProps {
  items: MenuItem[];
}

export function Menu({ items }: MenuProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const totalCartItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.dishName === item.dishName);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.dishName === item.dishName
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (dishName: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.dishName === dishName);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.dishName === dishName
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter((cartItem) => cartItem.dishName !== dishName);
    });
  };

  const getCartItem = (dishName: string) => {
    return cart.find((item) => item.dishName === dishName);
  };
  
  const clearCart = () => {
      setCart([]);
  }

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Empty Order',
        description: 'Please add items to your order before placing it.',
        variant: 'destructive',
      });
      return;
    }
    if (!tableNumber.trim()) {
      toast({
        title: 'Table Number Required',
        description: 'Please enter your table number to place the order.',
        variant: 'destructive',
      });
      return;
    }


    setIsPlacingOrder(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: 'Order Placed Successfully!',
      description: `Your order for table #${tableNumber} is being prepared. Total: $${cartTotal.toFixed(
        2
      )}`,
    });

    // Reset state
    setCart([]);
    setTableNumber('');
    setIsPlacingOrder(false);
    setIsSheetOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-muted/30 dark:bg-black">
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-full text-primary-foreground">
              <Utensils className="h-6 w-6" />
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold text-primary">
              Our Menu
            </h1>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="relative rounded-full h-12 w-12 p-0 sm:w-auto sm:px-4 shadow-lg flex items-center justify-center"
              >
                <ShoppingCart className="h-6 w-6 sm:mr-2" />
                <div className="hidden sm:flex items-center gap-2">
                  <span className="font-mono">${cartTotal.toFixed(2)}</span>
                </div>
                {totalCartItems > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center border-2 border-background">
                    {totalCartItems}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col sm:max-w-md p-0">
              <SheetHeader className="p-6 pb-4">
                <SheetTitle className="font-headline text-2xl">Your Order</SheetTitle>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto px-6 py-2">
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.dishName}
                        className="flex items-center gap-2 sm:gap-4 animate-in fade-in"
                      >
                        <Image
                          src={`https://placehold.co/100x100.png`}
                          alt={item.dishName}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                          data-ai-hint="food dish"
                        />
                        <div className="flex-grow">
                          <p className="font-semibold text-sm sm:text-base leading-tight">{item.dishName}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full"
                            onClick={() => handleRemoveFromCart(item.dishName)}
                          >
                            <Minus className="h-5 w-5" />
                          </Button>
                          <span className="font-bold w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full"
                            onClick={() => handleAddToCart(item)}
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </div>
                        <p className="font-bold w-16 text-right text-sm sm:text-base">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <ShoppingCart className="h-16 w-16 mb-4" />
                    <p className="text-lg font-semibold">Your cart is empty.</p>
                    <p className="text-sm">Start adding delicious items from the menu!</p>
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <SheetFooter className="mt-auto p-6 pt-4 border-t bg-background">
                  <div className="w-full space-y-4">
                    <div className="flex justify-between font-bold text-xl">
                      <span>Total:</span>
                      <span className="font-mono">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tableNumber" className="text-base">
                        Table Number
                      </Label>
                      <Input
                        id="tableNumber"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="e.g., 14"
                        className="text-base p-6 rounded-lg"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="w-1/3" onClick={clearCart}>
                        <Trash2 className="mr-2 h-4 w-4" /> Clear
                      </Button>
                      <Button
                        className="w-2/3"
                        size="lg"
                        onClick={handlePlaceOrder}
                        disabled={isPlacingOrder}
                      >
                        {isPlacingOrder ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                          <ShoppingCart className="mr-2 h-5 w-5" />
                        )}
                        {isPlacingOrder ? 'Placing...' : 'Place Order'}
                      </Button>
                    </div>
                  </div>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
          {items.map((item, index) => {
            const cartItem = getCartItem(item.dishName);
            return (
              <Card
                key={index}
                className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-none bg-card animate-in fade-in slide-in-from-bottom-4 flex flex-col"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="aspect-[16/10] relative">
                  <Image
                    src={`https://placehold.co/600x400.png`}
                    alt={item.dishName}
                    fill
                    className="object-cover"
                    data-ai-hint="food dish"
                  />
                </div>
                <CardContent className="p-4 sm:p-6 space-y-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-bold font-headline text-foreground leading-tight">
                      {item.dishName}
                    </h3>
                    <div className="text-lg font-bold text-primary whitespace-nowrap pt-px font-mono">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-center pt-2">
                    {!cartItem ? (
                      <Button className="w-full h-12 text-base" onClick={() => handleAddToCart(item)}>
                        <Plus className="mr-2 h-5 w-5" /> Add to Order
                      </Button>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-12 w-12"
                          onClick={() => handleRemoveFromCart(item.dishName)}
                        >
                          <Minus className="h-6 w-6" />
                        </Button>
                        <span className="text-2xl font-bold w-12 text-center">
                          {cartItem.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-12 w-12"
                          onClick={() => handleAddToCart(item)}
                        >
                          <Plus className="h-6 w-6" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
