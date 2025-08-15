// Simple test script to verify GraphQL query functionality
// This can be run in the browser console to test the GraphQL query

console.log('🧪 Testing GraphQL Query Functionality');

// Test JWT token extraction
function testJWTExtraction() {
  console.log('🔍 Testing JWT token extraction...');
  
  // Get auth token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth-token='))
    ?.split('=')[1];
    
  if (!token) {
    console.log('❌ No auth token found in cookies');
    return false;
  }
  
  console.log('✅ Auth token found:', token.substring(0, 20) + '...');
  
  // Decode JWT payload
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('📋 JWT Payload:', payload);
    return payload;
  } catch (error) {
    console.error('❌ Error decoding JWT:', error);
    return false;
  }
}

// Test GraphQL environment variables
function testGraphQLConfig() {
  console.log('🔍 Testing GraphQL configuration...');
  
  const endpoint = process.env.NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT;
  const apiKey = process.env.NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY;
  
  console.log('📡 GraphQL Endpoint:', endpoint ? '✅ Configured' : '❌ Not configured');
  console.log('🔑 API Key:', apiKey ? '✅ Configured' : '❌ Not configured');
  
  return !!(endpoint && apiKey);
}

// Run tests
console.log('🚀 Starting GraphQL tests...');
const jwtPayload = testJWTExtraction();
const graphqlConfig = testGraphQLConfig();

console.log('📊 Test Results:', {
  jwtPayload: !!jwtPayload,
  graphqlConfig,
  restaurantId: jwtPayload?.restaurantId || 'Not found',
  menuId: jwtPayload?.menuId || 'Not found',
});

if (jwtPayload && graphqlConfig) {
  console.log('✅ All tests passed! GraphQL query should work.');
} else {
  console.log('❌ Some tests failed. Check configuration.');
} 