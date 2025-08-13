/**
 * GraphQL Mutations
 * Mutation definitions for menu management operations
 */

// GraphQL mutation strings - using template literals instead of gql

// ============================================================================
// INSERT CATEGORY MUTATION
// ============================================================================

export const INSERT_CATEGORY = `
  mutation InsertCategory($menu_id: ID!, $name: String!) {
    insertCategory(menu_id: $menu_id, name: $name) {
      id
      name
      menu_id
    }
  }
`;

// ============================================================================
// INSERT MENU ITEM MUTATION
// ============================================================================

export const INSERT_MENU_ITEM = `
  mutation InsertMenuItem(
    $name: String!
    $description: String
    $price: Float!
    $image_url: String
    $available: Boolean
    $category_id: ID
    $sub_category_id: ID
  ) {
    insertMenuItem(
      name: $name
      description: $description
      price: $price
      image_url: $image_url
      available: $available
      category_id: $category_id
      sub_category_id: $sub_category_id
    ) {
      id
      name
      price
      category_id
      sub_category_id
    }
  }
`;

// ============================================================================
// INSERT MULTIPLE MENU ITEMS MUTATION
// ============================================================================

export const INSERT_MULTIPLE_MENU_ITEMS = `
  mutation InsertMultipleMenuItems($input: InsertMultipleMenuItemsInput!) {
    insertMultipleMenuItems(input: $input) {
      success
      message
      menuId
      errors
    }
  }
`; 