// This is a wrapper around the native fetch API to handle common tasks
// like adding headers, handling errors, etc.

const BASE_URL = '/api'; // This will be the prefix for all API calls

interface RequestOptions extends RequestInit {
  data?: any;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...customConfig } = options;

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...customConfig,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  // In a real app, we would fetch from the backend
  // const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  // For now, we'll simulate a network delay and return mock data
  // logic handled in specific services
  return Promise.resolve({} as T);
}

// Helper to simulate network delay
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
