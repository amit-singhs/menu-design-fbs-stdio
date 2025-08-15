/**
 * GraphQL Error Handling System
 * Comprehensive error handling for GraphQL operations
 */

import { GraphQLError, NetworkError, ErrorResponse } from './types';
import { GraphQLErrorType } from './config';

/**
 * GraphQL Error Handler Class
 * Provides centralized error handling for all GraphQL operations
 */
export class GraphQLErrorHandler {
  /**
   * Handle GraphQL errors and return user-friendly messages
   */
  static handleError(error: any): { message: string; type: GraphQLErrorType } {
    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        message: 'Network connection failed. Please check your internet connection.',
        type: GraphQLErrorType.NETWORK_ERROR,
      };
    }

    // HTTP errors
    if (error.status) {
      switch (error.status) {
        case 401:
          return {
            message: 'Authentication failed. Please log in again.',
            type: GraphQLErrorType.AUTHENTICATION_ERROR,
          };
        case 403:
          return {
            message: 'Access denied. You do not have permission to perform this action.',
            type: GraphQLErrorType.AUTHENTICATION_ERROR,
          };
        case 404:
          return {
            message: 'Resource not found. Please check your request.',
            type: GraphQLErrorType.VALIDATION_ERROR,
          };
        case 500:
          return {
            message: 'Server error. Please try again later.',
            type: GraphQLErrorType.NETWORK_ERROR,
          };
        default:
          return {
            message: `Request failed with status ${error.status}. Please try again.`,
            type: GraphQLErrorType.NETWORK_ERROR,
          };
      }
    }

    // GraphQL errors
    if (error.errors && Array.isArray(error.errors)) {
      const firstError = error.errors[0];
      return {
        message: firstError.message || 'GraphQL operation failed.',
        type: GraphQLErrorType.GRAPHQL_ERROR,
      };
    }

    // Generic error
    return {
      message: error.message || 'An unexpected error occurred. Please try again.',
      type: GraphQLErrorType.NETWORK_ERROR,
    };
  }

  /**
   * Check if error is retryable
   */
  static isRetryableError(error: any): boolean {
    const errorInfo = this.handleError(error);
    
    // Don't retry authentication errors
    if (errorInfo.type === GraphQLErrorType.AUTHENTICATION_ERROR) {
      return false;
    }
    
    // Don't retry validation errors
    if (errorInfo.type === GraphQLErrorType.VALIDATION_ERROR) {
      return false;
    }
    
    // Retry network errors and server errors
    return errorInfo.type === GraphQLErrorType.NETWORK_ERROR || 
           errorInfo.type === GraphQLErrorType.GRAPHQL_ERROR;
  }

  /**
   * Get retry delay based on error type and attempt count
   */
  static getRetryDelay(attempt: number, error: any): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 10000; // 10 seconds
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    
    // Add some jitter to prevent thundering herd
    const jitter = Math.random() * 1000;
    return delay + jitter;
  }

  /**
   * Log error for debugging
   */
  static logError(error: any, context?: string): void {
    console.error(`GraphQL Error${context ? ` (${context})` : ''}:`, {
      error,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    });
  }

  /**
   * Create user-friendly error message
   */
  static createUserMessage(error: any): string {
    const errorInfo = this.handleError(error);
    return errorInfo.message;
  }

  /**
   * Validate GraphQL response
   */
  static validateResponse(response: any): { isValid: boolean; error?: string } {
    if (!response) {
      return { isValid: false, error: 'No response received' };
    }

    if (response.errors && response.errors.length > 0) {
      const firstError = response.errors[0];
      return { 
        isValid: false, 
        error: firstError.message || 'GraphQL operation failed' 
      };
    }

    if (response.error) {
      return { 
        isValid: false, 
        error: response.error.message || 'Request failed' 
      };
    }

    return { isValid: true };
  }
}

/**
 * Hook for handling GraphQL errors in React components
 */
export const useGraphQLErrorHandler = () => {
  const handleError = (error: any, context?: string) => {
    GraphQLErrorHandler.logError(error, context);
    return GraphQLErrorHandler.createUserMessage(error);
  };

  const isRetryable = (error: any) => {
    return GraphQLErrorHandler.isRetryableError(error);
  };

  const getRetryDelay = (attempt: number, error: any) => {
    return GraphQLErrorHandler.getRetryDelay(attempt, error);
  };

  return {
    handleError,
    isRetryable,
    getRetryDelay,
  };
}; 