// Global type definitions

export interface ApiError {
  message: string;
  statusCode?: number;
}

// Extend Express Request if needed
declare global {
  namespace Express {
    interface Request {
      // Add custom properties here as needed
    }
  }
}

