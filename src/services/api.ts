
const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  gstin: string;
  clientType: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  registrationDate: string;
  status: string;
}

interface ClientRegistrationData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  gstin: string;
  clientType: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Stats {
  totalClients: number;
  exporters: number;
  importers: number;
  both: number;
  thisMonth: number;
  activeDeclarations: number;
  pendingReviews: number;
  completedThisMonth: number;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'Request failed',
          message: data.message || 'An error occurred',
        };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: 'Network Error',
        message: 'Failed to connect to the server. Please check if the backend is running.',
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.makeRequest('/health');
  }

  // Client registration
  async registerClient(clientData: ClientRegistrationData): Promise<ApiResponse<{ client: Client }>> {
    return this.makeRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  // Get all clients
  async getClients(): Promise<ApiResponse<{ clients: Client[]; total: number }>> {
    return this.makeRequest('/clients');
  }

  // Get client by ID
  async getClient(id: string): Promise<ApiResponse<{ client: Client }>> {
    return this.makeRequest(`/clients/${id}`);
  }

  // Get statistics
  async getStats(): Promise<ApiResponse<Stats>> {
    return this.makeRequest('/stats');
  }
}

export const apiService = new ApiService();
export type { Client, ClientRegistrationData, Stats };
