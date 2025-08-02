import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, mobile, password, confirmPassword } = body;

    // Get environment variables (server-side)
    const authServiceEndpoint = process.env.AUTH_SERVICE_ENDPOINT;
    const authServiceApiKey = process.env.AUTH_SERVICE_API_KEY;

    if (!authServiceEndpoint || !authServiceApiKey) {
      return NextResponse.json(
        { error: 'Authentication service not configured' },
        { status: 500 }
      );
    }

    // Make request to external auth service
    const response = await fetch(`${authServiceEndpoint}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': authServiceApiKey,
      },
      body: JSON.stringify({ name, email, mobile, password, confirmPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      
      return NextResponse.json(
        { error: errorData.message || `HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 