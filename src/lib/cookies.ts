// Cookie management utilities for JWT tokens

export const COOKIE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: false, // Allow JavaScript access for client-side auth
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: '/',
} as const;

export const setCookie = (name: string, value: string, options?: Partial<typeof COOKIE_OPTIONS>) => {
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
  setCookie(name, '', { maxAge: -1 });
};

export const clearAuthCookies = () => {
  removeCookie(COOKIE_KEYS.AUTH_TOKEN);
  removeCookie(COOKIE_KEYS.USER_DATA);
}; 