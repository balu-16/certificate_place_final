// Configuration Management
// src/config/app.config.ts

export const AppConfig = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    timeout: 30000,
    retryAttempts: 3
  },
  
  database: {
    healthCheckInterval: 60000, // 1 minute
    connectionTimeout: 10000
  },
  
  ui: {
    toastDuration: 5000,
    loadingDebounce: 300,
    tablePageSize: 50
  },
  
  features: {
    enableDebugLogs: process.env.NODE_ENV === 'development',
    enableErrorReporting: process.env.NODE_ENV === 'production',
    enableOfflineMode: false
  }
} as const;

export type AppConfigType = typeof AppConfig;