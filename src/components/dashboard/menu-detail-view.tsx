'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Edit, 
  Trash2, 
  Plus, 
  ArrowLeft, 
  DollarSign,
  Package,
  Layers
} from 'lucide-react';
import { useAtom } from 'jotai';
import { selectedMenuAtom, menusAtom, selectedMenuIdAtom } from '@/lib/store/menu-store';
import { useUpdateMenuItem, useDeleteMenuItem, useInsertMenuItem } from '@/hooks/graphql/use-menu-items';
import { useInsertCategory, useInsertSubCategory } from '@/hooks/graphql/use-categories';
import type { Menu, Category, SubCategory, MenuItem } from '@/lib/store/menu-store';

interface MenuDetailViewProps {
  onBack: () => void;
}

export function MenuDetailView({ onBack }: MenuDetailViewProps) {
  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number = 15) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const [selectedMenu] = useAtom(selectedMenuAtom);
  const [selectedMenuId] = useAtom(selectedMenuIdAtom);
  const [menus, setMenus] = useAtom(menusAtom);
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const insertMenuItem = useInsertMenuItem();
  const insertCategory = useInsertCategory();
  const insertSubCategory = useInsertSubCategory();
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<{
    type: 'category' | 'subcategory' | 'item';
    id: string;
    name: string;
    description?: string;
    price?: number;
  } | null>(null);
  const [deletingItem, setDeletingItem] = useState<{
    id: string;
    name: string;
  } | null>(null);
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
  const [addingCategory, setAddingCategory] = useState<boolean>(false);

  if (!selectedMenu) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">No menu selected</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }


  const handleEdit = (type: 'category' | 'subcategory' | 'item', id: string, data: any) => {
    setEditingItem({ type, id, ...data });
  };

  const handleDelete = (type: 'category' | 'subcategory' | 'item', id: string, name: string) => {
    if (type === 'item') {
      setDeletingItem({ id, name });
    } else {
      // TODO: Implement delete functionality for categories and subcategories
      console.log(`Delete ${type} with id:`, id);
    }
  };

  const handleAddItem = (type: 'category' | 'subcategory', categoryId: string, categoryName: string, subcategoryId?: string, subcategoryName?: string) => {
    setAddingItem({ type, categoryId, categoryName, subcategoryId, subcategoryName });
  };

  const handleAddSubcategory = (categoryId: string, categoryName: string) => {
    setAddingSubcategory({ categoryId, categoryName });
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    const { id, name } = deletingItem;

    // Set loading state for this specific item
    setLoadingItems(prev => new Set(prev).add(id));

    // Store original menus for potential rollback
    const originalMenus = menus;

    // Optimistic update - immediately remove the item from UI
    const updatedMenus = menus.map(menu => {
      if (menu.id === selectedMenuId) {
        return {
          ...menu,
          categories: menu.categories.map(category => ({
            ...category,
            // Remove item from category's direct menu_items
            menu_items: category.menu_items?.filter(item => item.id !== id) || [],
            sub_categories: category.sub_categories.map(subCategory => ({
              ...subCategory,
              menu_items: subCategory.menu_items.filter(item => item.id !== id)
            })).filter(subCategory => subCategory.menu_items.length > 0) // Remove empty subcategories
          })).filter(category => 
            (category.menu_items && category.menu_items.length > 0) || 
            category.sub_categories.length > 0
          ) // Remove empty categories
        };
      }
      return menu;
    });

    // Update the state immediately
    setMenus(updatedMenus);

    try {
      // Call the GraphQL mutation
      await deleteMenuItem.mutateAsync({ id });
    } catch (error) {
      // If mutation fails, revert the optimistic update
      setMenus(originalMenus);
      console.error('Failed to delete menu item:', error);
    } finally {
      // Clear loading state for this specific item
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      // Close the delete confirmation dialog
      setDeletingItem(null);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;

    if (editingItem.type === 'item') {
      // Set loading state for this specific item
      setLoadingItems(prev => new Set(prev).add(editingItem.id));

      // Store original values for potential rollback
      const originalItem = selectedMenu.categories
        .flatMap(cat => [...(cat.menu_items || []), ...cat.sub_categories.flatMap(sub => sub.menu_items)])
        .find(item => item.id === editingItem.id);

      if (!originalItem) {
        console.error('Original item not found for rollback');
        setEditingItem(null);
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(editingItem.id);
          return newSet;
        });
        return;
      }

      // Optimistic update - immediately update the UI
      const updatedMenus = menus.map(menu => {
        if (menu.id === selectedMenuId) {
          return {
            ...menu,
            categories: menu.categories.map(category => ({
              ...category,
              // Update items directly under category
              menu_items: category.menu_items?.map(item => 
                item.id === editingItem.id 
                  ? { 
                      ...item, 
                      name: editingItem.name,
                      description: editingItem.description || '',
                      price: editingItem.price || 0
                    }
                  : item
              ) || [],
              sub_categories: category.sub_categories.map(subCategory => ({
                ...subCategory,
                menu_items: subCategory.menu_items.map(item => 
                  item.id === editingItem.id 
                    ? { 
                        ...item, 
                        name: editingItem.name,
                        description: editingItem.description || '',
                        price: editingItem.price || 0
                      }
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
        await updateMenuItem.mutateAsync({
          id: editingItem.id,
          name: editingItem.name,
          description: editingItem.description,
          price: editingItem.price,
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
                  item.id === editingItem.id 
                    ? originalItem // Revert to original state
                    : item
                ) || [],
                sub_categories: category.sub_categories.map(subCategory => ({
                  ...subCategory,
                  menu_items: subCategory.menu_items.map(item => 
                    item.id === editingItem.id 
                      ? originalItem // Revert to original state
                      : item
                  )
                }))
              }))
            };
          }
          return menu;
        });
        setMenus(revertedMenus);
        console.error('Failed to update menu item:', error);
      } finally {
        // Clear loading state for this specific item
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(editingItem.id);
          return newSet;
        });
      }
    }
    
    setEditingItem(null);
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

  const handleSaveNewCategory = async (name: string) => {
    if (!selectedMenuId) return;

    // Create the new category object (without ID - backend will generate UUID)
    const newCategory = {
      name: name,
      sub_categories: [],
      menu_items: [],
    };

    // Optimistic update to local state
    const updatedMenus = menus.map(menu => {
      if (menu.id === selectedMenuId) {
        return {
          ...menu,
          categories: [...menu.categories, newCategory]
        };
      }
      return menu;
    });

    // Update local state immediately
    setMenus(updatedMenus);

    try {
      await insertCategory.mutateAsync({
        menu_id: selectedMenuId,
        name: name,
      });
      
      setAddingCategory(false);
    } catch (error) {
      // Revert optimistic update on error
      setMenus(menus);
      console.error('Failed to add category:', error);
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
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          {item.price.toFixed(2)}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEdit('item', item.id, {
            name: item.name,
            description: item.description,
            price: item.price
          })}
          disabled={loadingItems.has(item.id)}
        >
          {loadingItems.has(item.id) ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <Edit className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete('item', item.id, item.name)}
          className="text-destructive hover:text-destructive"
          disabled={loadingItems.has(item.id)}
        >
          {loadingItems.has(item.id) ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
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
          Add Item to {subcategory.name}
        </Button>
      </AccordionContent>
    </AccordionItem>
  );

  const renderCategory = (category: Category, index?: number) => (
    <AccordionItem key={category.id || `temp-category-${index}`} value={category.id || `temp-category-${index}`}>
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
            {selectedMenu.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {selectedMenu.description}
          </p>
        </div>
      </div>

      {/* Menu Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Structure</CardTitle>
          <CardDescription>
            Manage categories, subcategories, and menu items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {selectedMenu.categories.map((category, index) => renderCategory(category, index))}
          </Accordion>
          
          <div className="mt-6 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setAddingCategory(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit {editingItem?.type === 'category' ? 'Category' : 
                    editingItem?.type === 'subcategory' ? 'Subcategory' : 'Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editingItem?.name || ''}
                onChange={(e) => setEditingItem(prev => 
                  prev ? { ...prev, name: e.target.value } : null
                )}
              />
            </div>
            {editingItem?.type === 'item' && (
              <>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={editingItem?.description || ''}
                    onChange={(e) => setEditingItem(prev => 
                      prev ? { ...prev, description: e.target.value } : null
                    )}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingItem?.price || ''}
                    onChange={(e) => setEditingItem(prev => 
                      prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null
                    )}
                  />
                </div>
              </>
            )}
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setEditingItem(null)}
                disabled={editingItem && loadingItems.has(editingItem.id)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={editingItem && loadingItems.has(editingItem.id)}
              >
                {editingItem && loadingItems.has(editingItem.id) ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{deletingItem?.name}"</strong>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={deletingItem && loadingItems.has(deletingItem.id)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deletingItem && loadingItems.has(deletingItem.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingItem && loadingItems.has(deletingItem.id) ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      {/* Add Category Dialog */}
      <AddCategoryDialog 
        open={addingCategory} 
        onOpenChange={setAddingCategory}
        onSave={handleSaveNewCategory}
        isLoading={insertCategory.isPending}
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

// Add Category Dialog Component
interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  isLoading: boolean;
}

function AddCategoryDialog({ open, onOpenChange, onSave, isLoading }: AddCategoryDialogProps) {
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
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new category for your menu. You can then add items directly to this category or create subcategories within it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
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
              {isLoading ? 'Adding...' : 'Add Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 