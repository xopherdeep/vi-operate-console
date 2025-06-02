/**
 * API client for making requests to our backend
 * Centralizes error handling and response processing
 */

// Common API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Base API client functions
export const apiClient = {
  /**
   * Generic fetch method for GET requests
   */
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(endpoint);
      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || `Failed to fetch data from ${endpoint}`);
      }
      
      return result.data as T;
    } catch (error) {
      console.error(`API Error (GET ${endpoint}):`, error);
      throw error;
    }
  },
  
  /**
   * Generic fetch method for POST requests
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || `Failed to post data to ${endpoint}`);
      }
      
      return result.data as T;
    } catch (error) {
      console.error(`API Error (POST ${endpoint}):`, error);
      throw error;
    }
  },
  
  /**
   * Generic fetch method for PUT requests
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || `Failed to update data at ${endpoint}`);
      }
      
      return result.data as T;
    } catch (error) {
      console.error(`API Error (PUT ${endpoint}):`, error);
      throw error;
    }
  },
  
  /**
   * Generic fetch method for DELETE requests
   */
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });
      
      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || `Failed to delete data at ${endpoint}`);
      }
      
      return result.data as T;
    } catch (error) {
      console.error(`API Error (DELETE ${endpoint}):`, error);
      throw error;
    }
  }
};