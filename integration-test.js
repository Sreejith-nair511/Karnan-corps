// Simple integration test to verify frontend-backend communication
async function testIntegration() {
  console.log("Testing frontend-backend integration...");
  
  try {
    // Test backend health endpoint
    const backendHealth = await fetch("http://localhost:8000/health");
    const backendData = await backendHealth.json();
    console.log("Backend health:", backendData);
    
    // Test frontend serving
    const frontendResponse = await fetch("http://localhost:3000");
    console.log("Frontend status:", frontendResponse.status);
    
    // Test API endpoint from frontend to backend
    const apiTest = await fetch("http://localhost:8000/api/v1/health");
    const apiData = await apiTest.json();
    console.log("API health:", apiData);
    
    console.log("Integration test completed successfully!");
    return true;
  } catch (error) {
    console.error("Integration test failed:", error);
    return false;
  }
}

// Run the test
testIntegration();