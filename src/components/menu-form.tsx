'use client';

import { useState, useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { generateDescriptionAction } from '@/app/actions';
import { useInsertMultipleMenuItems } from '@/hooks/graphql';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { menusAtom } from '@/lib/store/menu-store';
import { useMenuStorage } from '@/hooks/use-local-storage';
import { GraphQLButton } from '@/components/ui/graphql-loading';
import { PlusCircle, Save, Trash2, Wand2, ChevronsUpDown, CirclePlus, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

export const menuItemSchema = z.object({
  id: z.string().optional(),
  dishName: z.string().min(1, 'Dish name is required.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  available: z.boolean().optional().default(true),
});

const menuFormSchema = z.object({
  menuName: z.string().min(1, 'Menu name is required.'),
  menuDescription: z.string().optional(),
  items: z.array(menuItemSchema).min(1, 'Please add at least one menu item.'),
});

export type MenuFormValues = z.infer<typeof menuFormSchema>;

interface MenuFormProps {
  onMenuSaved: (data: MenuFormValues) => void;
}

export function MenuForm({ onMenuSaved }: MenuFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [generatingStates, setGeneratingStates] = useState<{ [key: number]: boolean }>({});
  
  // GraphQL mutations
  const insertMultipleMenuItems = useInsertMultipleMenuItems();
  const router = useRouter();
  const [menus, setMenus] = useAtom(menusAtom);
  const { updateMenus } = useMenuStorage();
  
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState<Record<number, boolean>>({});
  const [subcategoryPopoverOpen, setSubcategoryPopoverOpen] = useState<Record<number, boolean>>({});

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      menuName: '',
      menuDescription: '',
      items: [{ dishName: '', price: 0, description: '', category: '', subcategory: '', available: true }],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const watchedItems = useWatch({ control: form.control, name: 'items' });

  const uniqueCategories = useMemo(() => {
    const categories = watchedItems
      .map((item) => item.category)
      .filter((c): c is string => !!c);
    return Array.from(new Set(categories));
  }, [watchedItems]);

  const uniqueSubcategories = useMemo(() => {
    const subcategories: Record<string, string[]> = {};
    watchedItems.forEach((item) => {
      if (item.category && item.subcategory) {
        if (!subcategories[item.category]) {
          subcategories[item.category] = [];
        }
        if (!subcategories[item.category].includes(item.subcategory)) {
          subcategories[item.category].push(item.subcategory);
        }
      }
    });
    return subcategories;
  }, [watchedItems]);

  const handleGenerateDescription = async (index: number) => {
    setGeneratingStates(prev => ({ ...prev, [index]: true }));
    const dishName = form.getValues(`items.${index}.dishName`);
    const existingDescription = form.getValues(`items.${index}.description`);

    if (!dishName) {
      form.setError(`items.${index}.dishName`, {
        type: 'manual',
        message: 'Please enter a dish name first to generate a description.',
      });
      setGeneratingStates(prev => ({ ...prev, [index]: false }));
      return;
    }

    try {
      const result = await generateDescriptionAction({ dishName, existingDescription });
      if (result.description) {
        form.setValue(`items.${index}.description`, result.description, {
          shouldValidate: true,
          shouldDirty: true,
        });
        toast({
          title: 'Description Generated!',
          description: `AI has crafted a new description for ${dishName}.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate description. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  const onSubmit = async (data: MenuFormValues) => {
    setIsSaving(true);
    console.log('Menu Data:', data);
    
    try {
      // Transform menu items to match the expected structure
      const menuItems = data.items.map(item => ({
        name: item.dishName,
        description: item.description,
        price: item.price,
        image_url: '', // Default empty image URL
        available: true, // Default to available
        category: item.category || '',
        sub_category: item.subcategory || '',
      }));

      // Call the mutation with the new structure
      const result = await insertMultipleMenuItems.mutateAsync({
        input: {
          menuName: data.menuName,
          descriptions: data.menuDescription || '',
          menuItems: menuItems,
        },
      });
      // Check if the mutation was successful
      if (result.insertMultipleMenuItems.success) {
    
        toast({
          title: 'Menu Saved!',
          description: result.insertMultipleMenuItems.message || `Your '${data.menuName}' menu has been successfully created.`,
        });
        
        // Update local storage with the new menu
        // We'll need to refetch the menus to get the complete data structure
        // For now, we'll invalidate the query to trigger a refetch
        router.push('/dashboard/menu');
      } else {
        // Handle errors from the mutation
        const errors = result.insertMultipleMenuItems.errors;
        const errorMessage = errors && errors.length > 0 
          ? errors.join(', ') 
          : 'Failed to save menu. Please try again.';
        
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving menu:', error);
      toast({
        title: 'Error',
        description: 'Failed to save menu. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen w-full p-4 sm:p-6 md:p-8 animate-in fade-in duration-500">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">
              Craft Your Menu
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Give your menu a name, then add your dishes below.
            </p>
          </div>

          <Card className="shadow-lg rounded-xl overflow-hidden">
             <CardHeader className="bg-muted/50 p-4">
                <h3 className="font-headline text-xl text-primary">Menu Details</h3>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <FormField
                    control={form.control}
                    name="menuName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-base">Menu Name</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Dinner Menu, Cocktails, Desserts" {...field} className="text-base p-6 rounded-lg" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="menuDescription"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-base">Menu Description</FormLabel>
                        <FormControl>
                        <Textarea placeholder="e.g. A curated selection of our signature dishes and timeless favorites." {...field} className="text-base p-4 rounded-lg min-h-[100px]" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </CardContent>
          </Card>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="shadow-lg rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500">
                <CardHeader className="bg-muted/50 p-4 flex flex-row items-center justify-between">
                  <h3 className="font-headline text-xl text-primary">Item #{index + 1}</h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name={`items.${index}.dishName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Dish Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Classic Margherita Pizza" {...field} className="text-base p-6 rounded-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Price</FormLabel>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">$</span>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="12.99"
                                {...field}
                                className="pl-8 text-base p-6 rounded-lg"
                                step="0.01"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField
                        control={form.control}
                        name={`items.${index}.category`}
                        render={({ field }) => {
                            const inputValue = field.value || '';
                            const isNew = inputValue && !uniqueCategories.some(c => c.toLowerCase() === inputValue.toLowerCase());
                            const filteredCategories = uniqueCategories.filter(c => c.toLowerCase().includes(inputValue.toLowerCase()));

                            return (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-base">
                                  Category (Optional)
                                </FormLabel>
                                <Popover
                                  open={categoryPopoverOpen[index]}
                                  onOpenChange={(isOpen) =>
                                    setCategoryPopoverOpen((prev) => ({
                                      ...prev,
                                      [index]: isOpen,
                                    }))
                                  }
                                >
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "w-full justify-between h-12 text-base",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                        onFocus={() =>
                                          setCategoryPopoverOpen((prev) => ({
                                            ...prev,
                                            [index]: true,
                                          }))
                                        }
                                      >
                                        {field.value ||
                                          "Select or create category"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command shouldFilter={false}>
                                      <CommandInput
                                        placeholder="Search or create category..."
                                        value={inputValue}
                                        onValueChange={field.onChange}
                                      />
                                      <CommandList>
                                        <CommandEmpty>
                                          No category found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {isNew && (
                                            <CommandItem
                                              key={`create-${inputValue}`}
                                              value={inputValue}
                                              onSelect={() => {
                                                form.setValue(
                                                  `items.${index}.category`,
                                                  inputValue
                                                );
                                                setCategoryPopoverOpen(
                                                  (prev) => ({
                                                    ...prev,
                                                    [index]: false,
                                                  })
                                                );
                                              }}
                                            >
                                              <CirclePlus className="mr-2 h-4 w-4" />
                                              <span>Create "{inputValue}"</span>
                                            </CommandItem>
                                          )}
                                          {filteredCategories.map(
                                            (category) => (
                                              <CommandItem
                                                value={category}
                                                key={category}
                                                onSelect={() => {
                                                  form.setValue(
                                                    `items.${index}.category`,
                                                    category
                                                  );
                                                  setCategoryPopoverOpen(
                                                    (prev) => ({
                                                      ...prev,
                                                      [index]: false,
                                                    })
                                                  );
                                                }}
                                              >
                                                <CirclePlus
                                                  className={cn(
                                                    "mr-2 h-4 w-4",
                                                    category.toLowerCase() ===
                                                      field.value?.toLowerCase()
                                                      ? "opacity-100"
                                                      : "opacity-0"
                                                  )}
                                                />
                                                {category}
                                              </CommandItem>
                                            )
                                          )}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            );}}
                      />
                       <FormField
                          control={form.control}
                          name={`items.${index}.subcategory`}
                          render={({ field }) => {
                            const parentCategory = watchedItems[index]?.category || '';
                            const subcategoriesForParent = uniqueSubcategories[parentCategory] || [];
                            const inputValue = field.value || '';

                            const isNew = inputValue && !subcategoriesForParent.some(sc => sc.toLowerCase() === inputValue.toLowerCase());
                            const filteredSubcategories = subcategoriesForParent.filter(sc => sc.toLowerCase().includes(inputValue.toLowerCase()));

                            return (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-base">
                                  Subcategory (Optional)
                                </FormLabel>
                                <Popover
                                  open={subcategoryPopoverOpen[index]}
                                  onOpenChange={(isOpen) =>
                                    setSubcategoryPopoverOpen((prev) => ({
                                      ...prev,
                                      [index]: isOpen,
                                    }))
                                  }
                                >
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        disabled={!parentCategory}
                                        className={cn(
                                          "w-full justify-between h-12 text-base",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                        onFocus={() => {
                                          if (parentCategory) {
                                            setSubcategoryPopoverOpen(
                                              (prev) => ({
                                                ...prev,
                                                [index]: true,
                                              })
                                            );
                                          }
                                        }}
                                      >
                                        {field.value ||
                                          "Select or create subcategory"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command shouldFilter={false}>
                                      <CommandInput
                                        placeholder="Search or create subcategory..."
                                        value={inputValue}
                                        onValueChange={field.onChange}
                                      />
                                      <CommandList>
                                        <CommandEmpty>
                                          No subcategory found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {isNew && (
                                            <CommandItem
                                              key={`create-${inputValue}`}
                                              value={inputValue}
                                              onSelect={() => {
                                                form.setValue(
                                                  `items.${index}.subcategory`,
                                                  inputValue
                                                );
                                                setSubcategoryPopoverOpen(
                                                  (prev) => ({
                                                    ...prev,
                                                    [index]: false,
                                                  })
                                                );
                                              }}
                                            >
                                              <CirclePlus className="mr-2 h-4 w-4" />
                                              <span>Create "{inputValue}"</span>
                                            </CommandItem>
                                          )}
                                          {filteredSubcategories.map(
                                            (subcategory) => (
                                              <CommandItem
                                                value={subcategory}
                                                key={subcategory}
                                                onSelect={() => {
                                                  form.setValue(
                                                    `items.${index}.subcategory`,
                                                    subcategory
                                                  );
                                                  setSubcategoryPopoverOpen(
                                                    (prev) => ({
                                                      ...prev,
                                                      [index]: false,
                                                    })
                                                  );
                                                }}
                                              >
                                                <CirclePlus
                                                  className={cn(
                                                    "mr-2 h-4 w-4",
                                                    subcategory.toLowerCase() ===
                                                      field.value?.toLowerCase()
                                                      ? "opacity-100"
                                                      : "opacity-0"
                                                  )}
                                                />
                                                {subcategory}
                                              </CommandItem>
                                            )
                                          )}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            );}}
                        />
                   </div>
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                           <FormLabel className="text-base">Description</FormLabel>
                           <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGenerateDescription(index)}
                              disabled={generatingStates[index]}
                              className="text-primary hover:bg-primary/10 gap-2"
                            >
                               {generatingStates[index] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Wand2 className="h-4 w-4" />
                              )}
                              <span>
                                {generatingStates[index] ? 'Generating...' : 'Generate with AI'}
                              </span>
                            </Button>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your dish..."
                            {...field}
                            className="min-h-[120px] text-base p-4 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="border-2 border-dashed rounded-lg py-6 px-8 text-lg"
              onClick={() => append({ dishName: '', price: 0, description: '', category: '', subcategory: '', available: true })}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Another Item
            </Button>
          </div>
          <Separator />
          
          <div className="pb-24" /> {/* Spacer for floating button */}
          
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-50">
             <div className="max-w-4xl mx-auto flex justify-end">
                <GraphQLButton 
                  type="submit" 
                  isLoading={isSaving || insertMultipleMenuItems.isPending}
                  loadingText="Saving..."
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 px-8 rounded-xl shadow-lg"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save Menu
                </GraphQLButton>
              </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
