'use client';

import type { z } from 'zod';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { Utensils, ShoppingCart, Plus, Minus, Trash2, Loader2, Info } from 'lucide-react';
import type { menuItemSchema } from '@/components/menu-form';
import type { CartItem as CartItemType } from '@/context/order-context';
import { Separator } from './ui/separator';

export type MenuItem = z.infer<typeof menuItemSchema>;
export type CartItem = CartItemType;

type PlacedOrderInfo = {
  cart: CartItem[];
  tableNumber: string;
  specialInstructions?: string;
};

interface MenuProps {
  items: MenuItem[];
  onOrderPlaced: (order: PlacedOrderInfo) => void;
}

export function Menu({ items, onOrderPlaced }: MenuProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [orderInstructions, setOrderInstructions] = useState('');
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
      return [...prevCart, { ...item, quantity: 1, specialInstructions: '' }];
    });
  };
  
  const handleUpdateItemInstructions = (dishName: string, instructions: string) => {
    setCart(prevCart => prevCart.map(item => 
        item.dishName === dishName 
            ? { ...item, specialInstructions: instructions } 
            : item
    ));
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
      setOrderInstructions('');
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
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Order Placed Successfully!',
      description: `Your order for table #${tableNumber} is being prepared.`,
    });
    
    onOrderPlaced({ cart, tableNumber, specialInstructions: orderInstructions });

    // Reset state in case component is reused
    setCart([]);
    setTableNumber('');
    setOrderInstructions('');
    setIsPlacingOrder(false);
    setIsSheetOpen(false);
  };

  const groupedItems = useMemo(() => {
    const groups: Record<string, Record<string, MenuItem[]>> = {};

    items.forEach(item => {
      const category = item.category || 'Miscellaneous';
      const subcategory = item.subcategory || 'General';

      if (!groups[category]) {
        groups[category] = {};
      }
      if (!groups[category][subcategory]) {
        groups[category][subcategory] = [];
      }
      groups[category][subcategory].push(item);
    });

    return groups;
  }, [items]);

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
              <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle className="font-headline text-2xl">Your Order</SheetTitle>
                <SheetDescription>Review your items and add any special requests before ordering.</SheetDescription>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto px-6 py-2">
                {cart.length > 0 ? (
                  <div className="space-y-4 divide-y divide-border -mx-6 px-6">
                    {cart.map((item) => (
                      <div
                        key={item.dishName}
                        className="flex flex-col gap-2 sm:gap-4 animate-in fade-in pt-4"
                      >
                         <div className="flex items-center gap-4">
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
                         <Input 
                            placeholder="e.g. Extra spicy, no onions"
                            value={item.specialInstructions}
                            onChange={(e) => handleUpdateItemInstructions(item.dishName, e.target.value)}
                            className="text-sm h-9"
                         />
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
                     <div className="space-y-2">
                        <Label htmlFor="orderInstructions" className="text-base flex items-center gap-1">
                            <Info className="h-4 w-4 text-muted-foreground"/> Overall Instructions
                        </Label>
                        <Textarea
                            id="orderInstructions"
                            value={orderInstructions}
                            onChange={(e) => setOrderInstructions(e.target.value)}
                            placeholder="e.g., Allergic to peanuts, please deliver to the back patio."
                            className="text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tableNumber" className="text-base">
                        Table Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="tableNumber"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="e.g., 14"
                        className="text-base p-6 rounded-lg"
                      />
                    </div>
                    <div className="flex justify-between font-bold text-xl">
                      <span>Total:</span>
                      <span className="font-mono">${cartTotal.toFixed(2)}</span>
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
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-32 space-y-12">
        {Object.entries(groupedItems).map(([category, subcategories], categoryIndex) => (
          <div key={category} className="space-y-8 animate-in fade-in-50" style={{animationDelay: `${categoryIndex * 150}ms`}}>
            <div className="text-center">
              <h2 className="text-4xl font-extrabold font-headline tracking-tight text-primary">{category}</h2>
              <Separator className="mt-4 w-24 mx-auto" />
            </div>
            {Object.entries(subcategories).map(([subcategory, items]) => (
              <div key={subcategory} className="space-y-6">
                {subcategory !== 'General' && (
                  <h3 className="text-2xl font-bold font-headline text-foreground/80">{subcategory}</h3>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
                  {items.map((item, index) => {
                    const cartItem = getCartItem(item.dishName);
                    return (
                      <Card
                        key={index}
                        className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-none bg-card animate-in fade-in slide-in-from-bottom-4 flex flex-col"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CardContent className="p-6 space-y-4 flex flex-col flex-grow">
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="text-2xl font-bold font-headline text-foreground leading-tight">
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
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  );
}
