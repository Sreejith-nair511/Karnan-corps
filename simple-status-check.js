// Simple status check for Karnan Solar Verification application
async function checkStatus() {
  console.log("=== Karnan Solar Verification - Service Status Check ===\n");
  
  const services = [
    { url: "http://localhost:8000/health", name: "Backend Health" },
    { url: "http://localhost:8000/", name: "Backend Root" },
    { url: "http://localhost:8000/api/v1/health", name: "Backend API Health" },
    { url: "http://localhost:3000", name: "Frontend" }
  ];
  
  let allHealthy = true;
  
  for (const service of services) {
    try {
      const response = await fetch(service.url, { method: 'GET' });
      if (response.ok) {
        console.log(`✅ ${service.name} is running (Status: ${response.status})`);
      } else {
        console.log(`⚠️  ${service.name} responded with status ${response.status}`);
        allHealthy = false;
      }
    } catch (error) {
      console.log(`❌ ${service.name} is not accessible - ${error.message}`);
      allHealthy = false;
    }
  }
  
  console.log("\n=== Summary ===");
  if (allHealthy) {
    console.log("🎉 All services are running! The application is ready to use.");
    console.log("\nAccess the application at: http://localhost:3000");
    console.log("Access the API documentation at: http://localhost:8000/docs");
  } else {
    console.log("⚠️  Some services are not running properly.");
    console.log("Please check the logs and ensure all services are started.");
  }
}

// Run the check
checkStatus();