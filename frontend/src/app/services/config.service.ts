import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  private readonly apiUrl = environment.apiUrl;
  private readonly baseUrl = environment.baseUrl;

  getApiUrl(endpoint: string = ''): string {
    return `${this.apiUrl}${endpoint}`;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getFrontendUrl(): string {
    return environment.frontendUrl;
  }

  getAppName(): string {
    return environment.appName;
  }

  isProduction(): boolean {
    return environment.production;
  }

  getHeaders(): { [key: string]: string } {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };
  }

  getAuthHeaders(token: string): { [key: string]: string } {
    return {
      ...this.getHeaders(),
      'Authorization': `Bearer ${token}`
    };
  }
}
