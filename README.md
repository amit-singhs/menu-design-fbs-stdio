# Menu Design

This is a NextJS starter for a restaurant menu management system with both admin and public interfaces.

## Features

- **Admin Dashboard**: Manage menus, categories, subcategories, and menu items
- **Public Menu System**: QR code accessible menus for customers
- **Order Management**: Customer ordering system with cart functionality
- **Real-time Updates**: Optimistic UI updates with GraphQL integration

## Getting Started

To get started, take a look at `src/app/page.tsx`.

## Public Menu System

The application includes a public menu system that can be accessed via QR codes or direct URLs.

### Testing Paths

You can test the public menu system using these URLs:

#### Menu List Page
```
http://localhost:3000/restaurants/{restaurantId}/menus
```

**Example:**
```
http://localhost:3000/restaurants/1f13dadf-22d9-4e03-875e-1e146c6d47df/menus
```

#### Specific Menu Page
```
http://localhost:3000/restaurants/{restaurantId}/menus/{menuId}
```

**Example:**
```
http://localhost:3000/restaurants/1f13dadf-22d9-4e03-875e-1e146c6d47df/menus/a6fc71f5-226f-4f1e-86b4-e73077e0aa0a
```

### QR Code Integration

These URLs can be encoded in QR codes for easy customer access:
- Restaurant owners can generate QR codes pointing to their menu list page
- Customers can scan QR codes to view menus and place orders
- No authentication required for public access

### URL Structure

- **Path Parameters**: Uses clean, SEO-friendly URLs with restaurant and menu IDs
- **Error Handling**: Displays "Sorry Menu Unavailable" for malformed URLs
- **Responsive Design**: Works on all devices including mobile phones

### Features

- **Menu List**: Shows all available menus for a restaurant
- **Menu Detail**: Displays menu items organized by categories and subcategories
- **Order System**: Customers can add items to cart and place orders
- **Table Number**: Required for order placement
- **Special Instructions**: Support for item-specific and order-level instructions
