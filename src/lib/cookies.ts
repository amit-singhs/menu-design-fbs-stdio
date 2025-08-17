// Cookie management utilities for JWT tokens

export const COOKIE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  STAFF_AUTH_TOKEN: 'staff_auth_token',
  USER_DATA: 'user_data',
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: false, // Allow JavaScript access for client-side auth
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: '/',
} as const;

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export const setCookie = (name: string, value: string, options?: Partial<typeof COOKIE_OPTIONS>) => {
  if (!isBrowser()) {
    console.warn('Cannot set cookie during server-side rendering');
    return;
  }

  const cookieOptions = { ...COOKIE_OPTIONS, ...options };
  
  let cookieString = `${name}=${encodeURIComponent(value)}`;
  
  if (cookieOptions.maxAge) {
    cookieString += `; Max-Age=${cookieOptions.maxAge}`;
  }
  
  if (cookieOptions.path) {
    cookieString += `; Path=${cookieOptions.path}`;
  }
  
  if (cookieOptions.secure) {
    cookieString += '; Secure';
  }
  
  if (cookieOptions.sameSite) {
    cookieString += `; SameSite=${cookieOptions.sameSite}`;
  }
  
  if (cookieOptions.httpOnly) {
    cookieString += '; HttpOnly';
  }
  
  document.cookie = cookieString;
};

export const getCookie = (name: string): string | null => {
  if (!isBrowser()) {
    return null;
  }

  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  
  return null;
};

export const removeCookie = (name: string) => {
  if (!isBrowser()) {
    console.warn('Cannot remove cookie during server-side rendering');
    return;
  }

  setCookie(name, '', { maxAge: -1 });
};

export const clearAuthCookies = () => {
  if (!isBrowser()) {
    console.warn('Cannot clear auth cookies during server-side rendering');
    return;
  }

  removeCookie(COOKIE_KEYS.AUTH_TOKEN);
  removeCookie(COOKIE_KEYS.USER_DATA);
}; 