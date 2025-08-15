'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  ArrowLeft, 
  DollarSign,
  Package,
  Layers,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react';
import { useAtom } from 'jotai';
import { selectedMenuAtom, menusAtom, selectedMenuIdAtom } from '@/lib/store/menu-store';
import { useUpdateMenuItemAvailability, useInsertMenuItem } from '@/hooks/graphql/use-menu-items';
import { useInsertSubCategory } from '@/hooks/graphql/use-categories';
import type { Menu, Category, SubCategory, MenuItem } from '@/lib/store/menu-store';

interface MenuAvailabilityViewProps {
  onBack: () => void;
}

export function MenuAvailabilityView({ onBack }: MenuAvailabilityViewProps) {
  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number = 15) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const [selectedMenu] = useAtom(selectedMenuAtom);
  const [selectedMenuId] = useAtom(selectedMenuIdAtom);
  const [menus, setMenus] = useAtom(menusAtom);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const updateMenuItemAvailability = useUpdateMenuItemAvailability();
  const insertMenuItem = useInsertMenuItem();
  const insertSubCategory = useInsertSubCategory();
  const [addingItem, setAddingItem] = useState<{
    type: 'category' | 'subcategory';
    categoryId: string;
    categoryName: string;
    subcategoryId?: string;
    subcategoryName?: string;
  } | null>(null);
  const [addingSubcategory, setAddingSubcategory] = useState<{
    categoryId: string;
    categoryName: string;
  } | null>(null);

  if (!selectedMenu) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">No menu selected</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  const handleAddItem = (type: 'category' | 'subcategory', categoryId: string, categoryName: string, subcategoryId?: string, subcategoryName?: string) => {
    setAddingItem({ type, categoryId, categoryName, subcategoryId, subcategoryName });
  };

  const handleAddSubcategory = (categoryId: string, categoryName: string) => {
    setAddingSubcategory({ categoryId, categoryName });
  };

  const handleSaveNewItem = async (formData: { name: string; description: string; price: number; image_url?: string }) => {
    if (!addingItem) return;

    // Create the new item object (without ID - backend will generate UUID)
    const newItem = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      image_url: formData.image_url,
      available: true,
      category_id: addingItem.categoryId,
      sub_category_id: addingItem.subcategoryId || null,
    };

    // Optimistic update to local state
    const updatedMenus = menus.map(menu => {
      if (menu.id === selectedMenuId) {
        return {
          ...menu,
          categories: menu.categories.map(category => {
            if (category.id === addingItem.categoryId) {
              if (addingItem.subcategoryId) {
                // Add to subcategory
                return {
                  ...category,
                  sub_categories: category.sub_categories.map(subCategory => {
                    if (subCategory.id === addingItem.subcategoryId) {
                      return {
                        ...subCategory,
                        menu_items: [...subCategory.menu_items, newItem]
                      };
                    }
                    return subCategory;
                  })
                };
              } else {
                // Add directly to category
                return {
                  ...category,
                  menu_items: [...(category.menu_items || []), newItem]
                };
              }
            }
            return category;
          })
        };
      }
      return menu;
    });

    // Update local state immediately
    setMenus(updatedMenus);

    try {
      await insertMenuItem.mutateAsync({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        image_url: formData.image_url,
        available: true,
        category_id: addingItem.categoryId,
        sub_category_id: addingItem.subcategoryId || null,
      });
      
      setAddingItem(null);
    } catch (error) {
      // Revert optimistic update on error
      setMenus(menus);
      console.error('Failed to add menu item:', error);
    }
  };

  const handleSaveNewSubcategory = async (name: string) => {
    if (!addingSubcategory) return;

    // Create the new subcategory object (without ID - backend will generate UUID)
    const newSubcategory = {
      name: name,
      menu_items: [],
    };

    // Optimistic update to local state
    const updatedMenus = menus.map(menu => {
      if (menu.id === selectedMenuId) {
        return {
          ...menu,
          categories: menu.categories.map(category => {
            if (category.id === addingSubcategory.categoryId) {
              return {
                ...category,
                sub_categories: [...category.sub_categories, newSubcategory]
              };
            }
            return category;
          })
        };
      }
      return menu;
    });

    // Update local state immediately
    setMenus(updatedMenus);

    try {
      await insertSubCategory.mutateAsync({
        category_id: addingSubcategory.categoryId,
        name: name,
      });
      
      setAddingSubcategory(null);
    } catch (error) {
      // Revert optimistic update on error
      setMenus(menus);
      console.error('Failed to add subcategory:', error);
    }
  };

  const handleAvailabilityChange = async (itemId: string, newAvailability: boolean) => {
    // Set loading state for this specific item
    setLoadingItems(prev => new Set(prev).add(itemId));

    // Optimistic update - immediately update the UI
    const updatedMenus = menus.map(menu => {
      if (menu.id === selectedMenuId) {
        return {
          ...menu,
          categories: menu.categories.map(category => ({
            ...category,
            // Update items directly under category
            menu_items: category.menu_items?.map(item => 
              item.id === itemId 
                ? { ...item, available: newAvailability }
                : item
            ) || [],
            sub_categories: category.sub_categories.map(subCategory => ({
              ...subCategory,
              menu_items: subCategory.menu_items.map(item => 
                item.id === itemId 
                  ? { ...item, available: newAvailability }
                  : item
              )
            }))
          }))
        };
      }
      return menu;
    });

    // Update the state immediately
    setMenus(updatedMenus);

    try {
      // Call the GraphQL mutation
      await updateMenuItemAvailability.mutateAsync({
        id: itemId,
        available: newAvailability,
      });
    } catch (error) {
      // If mutation fails, revert the optimistic update
      const revertedMenus = menus.map(menu => {
        if (menu.id === selectedMenuId) {
          return {
            ...menu,
            categories: menu.categories.map(category => ({
              ...category,
              // Revert items directly under category
              menu_items: category.menu_items?.map(item => 
                item.id === itemId 
                  ? { ...item, available: !newAvailability } // Revert to original state
                  : item
              ) || [],
              sub_categories: category.sub_categories.map(subCategory => ({
                ...subCategory,
                menu_items: subCategory.menu_items.map(item => 
                  item.id === itemId 
                    ? { ...item, available: !newAvailability } // Revert to original state
                    : item
                  )
              }))
            }))
          };
        }
        return menu;
      });
      setMenus(revertedMenus);
      console.error('Failed to update item availability:', error);
    } finally {
      // Clear loading state for this specific item
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const renderMenuItem = (item: MenuItem, categoryId: string, subcategoryId?: string, index?: number) => (
    <div key={item.id || `temp-${item.name}-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <Package className="h-4 w-4 text-muted-foreground" />
          <div>
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          {item.price.toFixed(2)}
        </Badge>
        <div className="flex items-center gap-2">
          <Switch
            id={`availability-${item.id}`}
            checked={item.available !== false} // Default to true if not set
            onCheckedChange={(checked) => handleAvailabilityChange(item.id, checked)}
            disabled={loadingItems.has(item.id)}
          />
          <Label htmlFor={`availability-${item.id}`} className="sr-only">
            Toggle availability for {item.name}
          </Label>
          {loadingItems.has(item.id) && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          )}
          <Badge 
            variant={item.available !== false ? "default" : "destructive"}
            className="flex items-center gap-1 min-w-[100px] justify-center"
          >
            {item.available !== false ? (
              <>
                <CheckCircle className="h-3 w-3" />
                Available
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Unavailable
              </>
            )}
          </Badge>
        </div>
      </div>
    </div>
  );

  const renderSubCategory = (subcategory: SubCategory, categoryId: string, categoryName: string) => (
    <AccordionItem key={subcategory.id} value={subcategory.id}>
      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          {subcategory.name}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-6 space-y-3">
        {subcategory.menu_items.map((item, index) => 
          renderMenuItem(item, categoryId, subcategory.id, index)
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          onClick={() => handleAddItem('subcategory', categoryId, categoryName, subcategory.id, subcategory.name)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item to {truncateText(subcategory.name)}
        </Button>
      </AccordionContent>
    </AccordionItem>
  );

  const renderCategory = (category: Category) => (
    <AccordionItem key={category.id} value={category.id}>
      <AccordionTrigger className="text-xl font-headline hover:no-underline">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {category.name}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-4 space-y-4">
        {/* Items directly under category */}
        {category.menu_items && category.menu_items.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Items in {category.name}</h4>
            {category.menu_items.map((item, index) => 
              renderMenuItem(item, category.id, undefined, index)
            )}
          </div>
        )}

        {/* Subcategories */}
        {category.sub_categories.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Subcategories</h4>
            <Accordion type="multiple" className="w-full">
              {category.sub_categories.map(subcategory => 
                renderSubCategory(subcategory, category.id, category.name)
              )}
            </Accordion>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAddItem('category', category.id, category.name)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item in {truncateText(category.name)}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAddSubcategory(category.id, category.name)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Subcategory
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  // Count available and unavailable items
  const itemStats = selectedMenu.categories.reduce((stats, category) => {
    // Count items directly under category
    category.menu_items?.forEach(item => {
      if (item.available !== false) {
        stats.available++;
      } else {
        stats.unavailable++;
      }
    });
    
    // Count items under subcategories
    category.sub_categories.forEach(subCategory => {
      subCategory.menu_items.forEach(item => {
        if (item.available !== false) {
          stats.available++;
        } else {
          stats.unavailable++;
        }
      });
    });
    return stats;
  }, { available: 0, unavailable: 0 });

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Menus
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
            {selectedMenu.name} - Item Availability
          </h1>
          <p className="text-muted-foreground mt-1">
            {selectedMenu.description}
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Available Items</p>
                <p className="text-2xl font-bold text-green-600">{itemStats.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Unavailable Items</p>
                <p className="text-2xl font-bold text-red-600">{itemStats.unavailable}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Item Availability</CardTitle>
          <CardDescription>
            Toggle the availability of menu items. Unavailable items will not be shown to customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {selectedMenu.categories.map(renderCategory)}
          </Accordion>
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <AddItemDialog 
        open={!!addingItem} 
        onOpenChange={(open) => !open && setAddingItem(null)}
        addingItem={addingItem}
        onSave={handleSaveNewItem}
        isLoading={insertMenuItem.isPending}
      />

      {/* Add Subcategory Dialog */}
      <AddSubcategoryDialog 
        open={!!addingSubcategory} 
        onOpenChange={(open) => !open && setAddingSubcategory(null)}
        addingSubcategory={addingSubcategory}
        onSave={handleSaveNewSubcategory}
        isLoading={insertSubCategory.isPending}
      />
    </div>
  );
}

// Add Item Dialog Component
interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addingItem: {
    type: 'category' | 'subcategory';
    categoryId: string;
    categoryName: string;
    subcategoryId?: string;
    subcategoryName?: string;
  } | null;
  onSave: (formData: { name: string; description: string; price: number; image_url?: string }) => void;
  isLoading: boolean;
}

function AddItemDialog({ open, onOpenChange, addingItem, onSave, isLoading }: AddItemDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(formData.price);
    if (formData.name && formData.description && price > 0) {
      onSave({ ...formData, price });
      setFormData({ name: '', description: '', price: '', image_url: '' });
    }
  };

  const getDialogTitle = () => {
    if (!addingItem) return 'Add Item';
    if (addingItem.type === 'subcategory') {
      return `Add Item to ${addingItem.subcategoryName}`;
    }
    return `Add Item to ${addingItem.categoryName}`;
  };

  const getDialogDescription = () => {
    if (!addingItem) return '';
    if (addingItem.type === 'subcategory') {
      return `Add a new item to ${addingItem.categoryName} > ${addingItem.subcategoryName}`;
    }
    return `Add a new item to ${addingItem.categoryName}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Item Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter item name"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter item description"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Image URL (Optional)</label>
            <Input
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !formData.name || !formData.description || formData.price <= 0}
            >
              {isLoading ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Add Subcategory Dialog Component
interface AddSubcategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addingSubcategory: {
    categoryId: string;
    categoryName: string;
  } | null;
  onSave: (name: string) => void;
  isLoading: boolean;
}

function AddSubcategoryDialog({ open, onOpenChange, addingSubcategory, onSave, isLoading }: AddSubcategoryDialogProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      setName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subcategory to {addingSubcategory?.categoryName}</DialogTitle>
          <DialogDescription>
            Create a new subcategory within the "{addingSubcategory?.categoryName}" category.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Subcategory Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subcategory name"
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? 'Adding...' : 'Add Subcategory'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 