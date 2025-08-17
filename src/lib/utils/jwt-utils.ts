/**
 * JWT Token Utilities
 * Functions to extract restaurantId from JWT token and integrate with GraphQL operations
 */

import { getCookie } from '../cookies';

/**
 * JWT Token Payload interface
 */
export interface JWTPayload {
  id: string;
  user_name: string;
  restaurantId: string;
  menuId?: string; // Optional menuId field
  iat?: number;
  exp?: number;
}

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Extract restaurantId from JWT token stored in browser cookies
 * @returns restaurantId string or null if not found/invalid
 */
export function extractRestaurantIdFromToken(): string | null {
  try {
    // Only run in browser environment
    if (!isBrowser()) {
      console.log('❌ Not in browser environment for extractRestaurantIdFromToken');
      return null;
    }

    const token = getCookie('auth_token');
    
    console.log('🔍 extractRestaurantIdFromToken:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
    });
    
    if (!token) {
      console.warn('No auth token found in cookies');
      return null;
    }

    // Decode JWT token (without verification for client-side)
    const payload = decodeJWTPayload(token);
    
    console.log('🔍 JWT Payload:', {
      hasPayload: !!payload,
      restaurantId: payload?.restaurantId || 'Not found',
      user_name: payload?.user_name || 'Not found',
    });
    
    if (!payload || !payload.restaurantId) {
      console.warn('Invalid JWT token or missing restaurantId');
      return null;
    }

    return payload.restaurantId;
  } catch (error) {
    console.error('Error extracting restaurantId from token:', error);
    return null;
  }
}

/**
 * Extract menuId from JWT token stored in browser cookies
 * @returns menuId string or null if not found/invalid
 */
export function extractMenuIdFromToken(): string | null {
  try {
    // Only run in browser environment
    if (!isBrowser()) {
      return null;
    }

    const token = getCookie('auth_token');
    
    if (!token) {
      console.warn('No auth token found in cookies');
      return null;
    }

    // Decode JWT token (without verification for client-side)
    const payload = decodeJWTPayload(token);
    
    if (!payload || !payload.menuId) {
      console.warn('Invalid JWT token or missing menuId');
      return null;
    }

    return payload.menuId;
  } catch (error) {
    console.error('Error extracting menuId from token:', error);
    return null;
  }
}

/**
 * Decode JWT payload without verification (client-side only)
 * @param token JWT token string
 * @returns decoded payload or null if invalid
 */
export function decodeJWTPayload(token: string): JWTPayload | null {
  try {
    // Split the token into parts
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    return decodedPayload as JWTPayload;
  } catch (error) {
    console.error('Error decoding JWT payload:', error);
    return null;
  }
}

/**
 * Validate JWT token and check if it's expired
 * @param token JWT token string
 * @returns boolean indicating if token is valid and not expired
 */
export function isTokenValid(token: string): boolean {
  try {
    const payload = decodeJWTPayload(token);
    
    if (!payload) {
      return false;
    }

    // Check if token has expiration
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime >= payload.exp) {
        console.warn('JWT token has expired');
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error validating JWT token:', error);
    return false;
  }
}

/**
 * Get restaurantId for GraphQL operations
 * @returns restaurantId string or throws error if not available
 */
export function getRestaurantIdForGraphQL(): string {
  // Only run in browser environment
  if (!isBrowser()) {
    throw new Error('Cannot access cookies during server-side rendering');
  }

  const restaurantId = extractRestaurantIdFromToken();
  
  if (!restaurantId) {
    throw new Error('Restaurant ID not found. User may not be authenticated or token is invalid.');
  }
  
  return restaurantId;
}

/**
 * Validate authentication for GraphQL operations
 * @returns boolean indicating if user is properly authenticated
 */
export function validateGraphQLAuthentication(): boolean {
  try {
    // Only run in browser environment
    if (!isBrowser()) {
      console.log('❌ Not in browser environment');
      return false;
    }

    const restaurantId = extractRestaurantIdFromToken();
    console.log('🔍 validateGraphQLAuthentication:', {
      restaurantId: restaurantId || 'Not found',
      hasRestaurantId: !!restaurantId,
    });
    return !!restaurantId;
  } catch (error) {
    console.error('Authentication validation failed:', error);
    return false;
  }
}

/**
 * Create authentication error for GraphQL operations
 * @returns formatted error object
 */
export function createAuthenticationError() {
  return {
    message: 'Authentication required. Please log in again.',
    type: 'AUTHENTICATION_ERROR',
    status: 401,
  };
} 

/**
 * Decode JWT token and extract restaurantId from token string
 * @param token JWT token string
 * @returns restaurantId string or null if not found/invalid
 */
export function extractRestaurantIdFromTokenString(token: string): string | null {
  try {
    // Decode JWT token (without verification for client-side)
    const payload = decodeJWTPayload(token);
    
    if (!payload || !payload.restaurantId) {
      console.warn('Invalid JWT token or missing restaurantId');
      return null;
    }

    return payload.restaurantId;
  } catch (error) {
    console.error('Error extracting restaurantId from token string:', error);
    return null;
  }
} 