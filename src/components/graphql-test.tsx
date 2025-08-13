/**
 * GraphQL Test Component
 * Temporary component to test GraphQL implementation
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraphQLButton } from '@/components/ui/graphql-loading';
import { useInsertCategory, useInsertMultipleMenuItems } from '@/hooks/graphql';
import { toast } from '@/hooks/use-toast';

export function GraphQLTest() {
  const [categoryName, setCategoryName] = useState('');
  const [menuId, setMenuId] = useState('698d8967-ea7f-43f2-9185-e1ad43d41558');
  
  const insertCategory = useInsertCategory();
  const insertMultipleMenuItems = useInsertMultipleMenuItems();

  const handleInsertCategory = async () => {
    if (!categoryName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a category name',
        variant: 'destructive',
      });
      return;
    }

    try {
      await insertCategory.mutateAsync({
        menu_id: menuId,
        name: categoryName,
      });
      
      setCategoryName('');
      toast({
        title: 'Success',
        description: 'Category created successfully!',
      });
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive',
      });
    }
  };

  const handleInsertMultipleMenuItems = async () => {
    const testMenuItems = [
      {
        name: 'Test Pizza',
        description: 'A delicious test pizza',
        price: 12.99,
        available: true,
        category_id: 'test-category-id',
        sub_category_id: null,
      },
      {
        name: 'Test Salad',
        description: 'A fresh test salad',
        price: 8.99,
        available: true,
        category_id: 'test-category-id',
        sub_category_id: null,
      },
    ];

    try {
      await insertMultipleMenuItems.mutateAsync({
        menuItems: testMenuItems,
      });
      
      toast({
        title: 'Success',
        description: 'Menu items created successfully!',
      });
    } catch (error) {
      console.error('Error creating menu items:', error);
      toast({
        title: 'Error',
        description: 'Failed to create menu items',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">GraphQL Mutations Test</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Insert Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Menu ID:</label>
            <Input
              value={menuId}
              onChange={(e) => setMenuId(e.target.value)}
              placeholder="Enter menu ID"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Name:</label>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
          <GraphQLButton
            onClick={handleInsertCategory}
            isLoading={insertCategory.isPending}
            loadingText="Creating..."
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Create Category
          </GraphQLButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Insert Multiple Menu Items</CardTitle>
        </CardHeader>
        <CardContent>
          <GraphQLButton
            onClick={handleInsertMultipleMenuItems}
            isLoading={insertMultipleMenuItems.isPending}
            loadingText="Creating..."
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Create Test Menu Items
          </GraphQLButton>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>This component tests the GraphQL mutations:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>InsertCategory mutation</li>
          <li>InsertMultipleMenuItems mutation</li>
        </ul>
        <p className="mt-2">Check the browser console for detailed logs.</p>
      </div>
    </div>
  );
} 