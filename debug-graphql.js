// Comprehensive GraphQL Debug Script
// Run this in the browser console to debug GraphQL issues

console.log('🧪 Starting Comprehensive GraphQL Debug...');

// Step 1: Check environment variables
function checkEnvironmentVariables() {
  console.log('🔍 Step 1: Checking Environment Variables');
  
  const endpoint = process.env.NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT;
  const apiKey = process.env.NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY;
  
  console.log('Environment Variables:', {
    endpoint: endpoint || 'NOT SET',
    apiKey: apiKey ? 'SET' : 'NOT SET',
    hasEndpoint: !!endpoint,
    hasApiKey: !!apiKey,
  });
  
  return !!(endpoint && apiKey);
}

// Step 2: Check JWT token
function checkJWTToken() {
  console.log('🔍 Step 2: Checking JWT Token');
  
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];
    
  if (!token) {
    console.log('❌ No JWT token found in cookies');
    return false;
  }
  
  console.log('✅ JWT token found:', token.substring(0, 20) + '...');
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('📋 JWT Payload:', payload);
    
    const hasRestaurantId = !!payload.restaurantId;
    console.log('Restaurant ID:', payload.restaurantId || 'NOT FOUND');
    console.log('Has Restaurant ID:', hasRestaurantId);
    
    return hasRestaurantId;
  } catch (error) {
    console.error('❌ Error decoding JWT:', error);
    return false;
  }
}

// Step 3: Test GraphQL client creation
function testGraphQLClient() {
  console.log('🔍 Step 3: Testing GraphQL Client Creation');
  
  try {
    // This will test if the GraphQL client can be created
    const endpoint = process.env.NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT;
    const apiKey = process.env.NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY;
    
    if (!endpoint || !apiKey) {
      console.log('❌ Missing environment variables for GraphQL client');
      return false;
    }
    
    console.log('✅ GraphQL client can be created');
    return true;
  } catch (error) {
    console.error('❌ Error creating GraphQL client:', error);
    return false;
  }
}

// Step 4: Test manual GraphQL query
async function testManualGraphQLQuery() {
  console.log('🔍 Step 4: Testing Manual GraphQL Query');
  
  try {
    const endpoint = process.env.NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT;
    const apiKey = process.env.NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY;
    
    if (!endpoint || !apiKey) {
      console.log('❌ Missing environment variables');
      return false;
    }
    
    // Get restaurant ID from JWT
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];
      
    if (!token) {
      console.log('❌ No JWT token found');
      return false;
    }
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const restaurantId = payload.restaurantId;
    
    if (!restaurantId) {
      console.log('❌ No restaurant ID in JWT');
      return false;
    }
    
    console.log('🚀 Executing manual GraphQL query...');
    console.log('Restaurant ID:', restaurantId);
    
    const query = `
      query GetMenusWithItems($restaurantId: ID!) {
        menus(restaurant_id: $restaurantId) {
          name
          description
          categories {
            id
            name
            sub_categories {
              id
              name
              menu_items {
                id
                name
                description
                price
              }
            }
          }
        }
      }
    `;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        query,
        variables: { restaurantId },
      }),
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response ok:', response.ok);
    
    const result = await response.json();
    console.log('📥 Response data:', result);
    
    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors);
      return false;
    }
    
    console.log('✅ Manual GraphQL query successful');
    return true;
  } catch (error) {
    console.error('❌ Error in manual GraphQL query:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running all GraphQL tests...');
  
  const envVars = checkEnvironmentVariables();
  const jwtToken = checkJWTToken();
  const graphqlClient = testGraphQLClient();
  const manualQuery = await testManualGraphQLQuery();
  
  console.log('📊 Test Results:', {
    environmentVariables: envVars,
    jwtToken,
    graphqlClient,
    manualQuery,
    allPassed: envVars && jwtToken && graphqlClient && manualQuery,
  });
  
  if (envVars && jwtToken && graphqlClient && manualQuery) {
    console.log('✅ All tests passed! GraphQL should work.');
  } else {
    console.log('❌ Some tests failed. Check the issues above.');
  }
}

// Export functions for manual testing
window.debugGraphQL = {
  checkEnvironmentVariables,
  checkJWTToken,
  testGraphQLClient,
  testManualGraphQLQuery,
  runAllTests,
};

console.log('🔧 Debug functions available as window.debugGraphQL');
console.log('Run: window.debugGraphQL.runAllTests() to test everything'); 