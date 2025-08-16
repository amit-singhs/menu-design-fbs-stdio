# Menu Design

This is a NextJS starter for a restaurant menu management system with both admin and public interfaces.

## Features

- **Admin Dashboard**: Manage menus, categories, subcategories, and menu items
- **Public Menu System**: QR code accessible menus for customers
- **Order Management**: Customer ordering system with cart functionality and real API integration
- **Order Status Tracking**: Order status display with manual refresh capability
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
- **Order Status**: Real-time tracking of order progress with automatic updates
- **API Integration**: Full REST API integration for order creation and status tracking

## Order Management API

The application integrates with a REST API for order management operations.

### API Endpoints

- **POST** `/api/orders` - Create a new order
- **GET** `/api/orders/{orderId}` - Get order status

### Environment Variables

Add the following to your `.env` file:

```env
NEXT_PUBLIC_ORDERS_MANAGEMENT_ENDPOINT=http://localhost:8080/api
```

### Order Flow

1. **Order Creation**: Customer places order through menu interface
2. **API Call**: Order data sent to backend via REST API
3. **Status Display**: Order status fetched once and displayed
4. **Manual Refresh**: User can refresh page to get updated status

### Features

- **Single API Call**: One-time status fetch when page loads
- **Error Handling**: Comprehensive error handling with user feedback
- **Toast Notifications**: Success and error messages for all operations
- **Loading States**: Proper loading indicators during API calls
- **Cost Efficient**: No unnecessary polling or repeated API calls
