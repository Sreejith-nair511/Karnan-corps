# Frontend Integration Example

This document provides examples of how to integrate with the Karnan backend API from a frontend application.

## API Base URL

```
http://localhost:8000/api/v1
```

## Example API Calls

### 1. Upload CSV File

```javascript
const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/v1/uploads/csv', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.job_id;
};
```

### 2. Check Job Status

```javascript
const checkJobStatus = async (jobId) => {
  const response = await fetch(`/api/v1/jobs/${jobId}`);
  const data = await response.json();
  return data;
};
```

### 3. Get Site Verification

```javascript
const getSiteVerification = async (sampleId) => {
  const response = await fetch(`/api/v1/site/${sampleId}`);
  const data = await response.json();
  return data;
};
```

### 4. Run Single Verification

```javascript
const verifySingleSite = async (siteData) => {
  const response = await fetch('/api/v1/verify/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(siteData),
  });

  const data = await response.json();
  return data;
};
```

### 5. Get Leaderboard

```javascript
const getLeaderboard = async () => {
  const response = await fetch('/api/v1/leaderboard');
  const data = await response.json();
  return data;
};
```

### 6. Submit Fraud Report

```javascript
const submitFraudReport = async (sampleId, reason, attachment) => {
  const formData = new FormData();
  formData.append('sample_id', sampleId);
  formData.append('reason', reason);
  if (attachment) {
    formData.append('attachment', attachment);
  }

  const response = await fetch('/api/v1/report', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data;
};
```

### 7. Get Metrics

```javascript
const getMetrics = async () => {
  const response = await fetch('/api/v1/metrics');
  const data = await response.json();
  return data;
};
```

### 8. Chat with SuryaBot

```javascript
const chatWithSuryaBot = async (message, lang = 'en') => {
  const response = await fetch('/api/v1/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lang,
      message,
    }),
  });

  const data = await response.json();
  return data;
};
```

## WebSocket Integration (Optional)

For real-time updates on job progress, you can use WebSocket connections:

```javascript
const connectToJobUpdates = (jobId) => {
  const ws = new WebSocket(`ws://localhost:8000/ws/jobs/${jobId}`);
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Update UI with job progress
    console.log('Job progress:', data);
  };
  
  return ws;
};
```

## Error Handling

Always handle potential errors in your API calls:

```javascript
const handleApiCall = async (apiFunction) => {
  try {
    const result = await apiFunction();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

## Authentication

For endpoints that require authentication, include the JWT token in the Authorization header:

```javascript
const authenticatedFetch = (url, options = {}) => {
  const token = localStorage.getItem('authToken'); // Or however you store the token
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
};
```

This integration example should help you connect your frontend application to the Karnan backend API.