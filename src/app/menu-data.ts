import type { FullMenu } from "@/components/welcome/welcome-page";

export const DUMMY_MENUS: FullMenu[] = [
    {
        name: "Dinner Menu",
        items: [
            { dishName: "Grilled Salmon", price: 24.99, description: "Fresh Atlantic salmon grilled to perfection, served with asparagus and lemon-dill sauce.", category: "Main Courses", subcategory: "Seafood", available: true },
            { dishName: "Ribeye Steak", price: 32.50, description: "A 12oz cut, seasoned and grilled, served with mashed potatoes and seasonal vegetables.", category: "Main Courses", subcategory: "Steaks", available: true },
            { dishName: "Chicken Alfredo", price: 18.99, description: "Fettuccine pasta tossed in a creamy Alfredo sauce with grilled chicken breast.", category: "Main Courses", subcategory: "Pasta", available: true },
            { dishName: "Caesar Salad", price: 12.00, description: "Crisp romaine lettuce, house-made Caesar dressing, parmesan cheese, and croutons.", category: "Appetizers", subcategory: "Salads", available: true },
            { dishName: "Molten Chocolate Lava Cake", price: 9.50, description: "Warm chocolate cake with a gooey center, served with vanilla bean ice cream.", category: "Desserts", available: true },
        ]
    },
    {
        name: "Cocktail & Drinks Menu",
        items: [
            { dishName: "Old Fashioned", price: 14.00, description: "Bourbon, Angostura bitters, sugar, and a twist of orange peel.", category: "Cocktails", subcategory: "Classic Cocktails", available: true },
            { dishName: "Margarita", price: 13.50, description: "Tequila, lime juice, and Cointreau, served in a salt-rimmed glass.", category: "Cocktails", subcategory: "Tequila-Based", available: true },
            { dishName: "Espresso Martini", price: 15.00, description: "Vodka, coffee liqueur, and a shot of fresh espresso.", category: "Cocktails", subcategory: "Modern Classics", available: true },
            { dishName: "Pinot Noir", price: 12.00, description: "A glass of smooth, medium-bodied red wine.", category: "Wine", subcategory: "Red", available: true },
            { dishName: "Sauvignon Blanc", price: 11.00, description: "A crisp and refreshing white wine with citrus notes.", category: "Wine", subcategory: "White", available: true },
            { dishName: "Sparkling Water", price: 4.00, description: "Choice of San Pellegrino or Perrier.", category: "Non-Alcoholic", available: true },
        ]
    }
]
