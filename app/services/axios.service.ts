import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'
import AuthHeader from './auth.header'

// Type definitions
interface AuthHeaders {
  [key: string]: string
}

interface ApiResponse<T = any> {
  data?: T
  error?: any
}

interface ErrorResponse {
  message?: string
  [key: string]: any
}

// Create a basic axios instance without the baseURL initially
export const Axios: AxiosInstance = axios.create()

// Function to set the base URL using the runtime config
export function setBaseUrl(baseUrl: string): void {
  Axios.defaults.baseURL = baseUrl
}

class AxiosService {
  /**
   * GET request
   * @param path - API endpoint path
   * @param showErrorToast - Whether to show error toast
   * @returns Promise with data or error
   */
  get<T = any>(path: string, showErrorToast: boolean = true): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      Axios.get<T>(path, { headers: AuthHeader() })
        .then(({ data }: AxiosResponse<T>) => {
          resolve({ data })
        })
        .catch((error: AxiosError<ErrorResponse>) =>
          this.handleError(error, resolve, showErrorToast)
        )
    })
  }

  /**
   * DELETE request
   * @param path - API endpoint path
   * @param showErrorToast - Whether to show error toast
   * @returns Promise with data or error
   */
  delete<T = any>(path: string, showErrorToast: boolean = true): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      Axios.delete<T>(path, { headers: AuthHeader() })
        .then(({ data }: AxiosResponse<T>) => {
          resolve({ data })
        })
        .catch((error: AxiosError<ErrorResponse>) =>
          this.handleError(error, resolve, showErrorToast)
        )
    })
  }

  /**
   * POST request
   * @param path - API endpoint path
   * @param data - Request payload
   * @param showErrorToast - Whether to show error toast
   * @returns Promise with data or error
   */
  post<T = any, D = any>(
    path: string,
    data: D,
    showErrorToast: boolean = true
  ): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      Axios.post<T>(path, data, { headers: AuthHeader() })
        .then(({ data }: AxiosResponse<T>) => {
          resolve({ data })
        })
        .catch((error: AxiosError<ErrorResponse>) =>
          this.handleError(error, resolve, showErrorToast)
        )
    })
  }

  /**
   * Patch request
   * @param path - API endpoint path
   * @param data - Request payload
   * @param showErrorToast - Whether to show error toast
   * @returns Promise with data or error
   */
  patch<T = any, D = any>(
    path: string,
    data: D,
    showErrorToast: boolean = true
  ): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      Axios.patch<T>(path, data, { headers: AuthHeader() })
        .then(({ data }: AxiosResponse<T>) => {
          resolve({ data })
        })
        .catch((error: AxiosError<ErrorResponse>) =>
          this.handleError(error, resolve, showErrorToast)
        )
    })
  }

  /**
   * PUT request
   * @param path - API endpoint path
   * @param data - Request payload
   * @param showErrorToast - Whether to show error toast
   * @returns Promise with data or error
   */
  put<T = any, D = any>(
    path: string,
    data: D,
    showErrorToast: boolean = true
  ): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      Axios.put<T>(path, data, { headers: AuthHeader() })
        .then(({ data }: AxiosResponse<T>) => {
          resolve({ data })
        })
        .catch((error: AxiosError<ErrorResponse>) =>
          this.handleError(error, resolve, showErrorToast)
        )
    })
  }

  /**
   * Download file
   * @param path - API endpoint path
   * @returns Promise with blob response
   */
  downloadFile(path: string): Promise<AxiosResponse<Blob>> {
    return Axios.get<Blob>(path, {
      headers: AuthHeader(),
      responseType: 'blob',
    })
  }

  /**
   * Handle API errors
   * @param error - Axios error object
   * @param resolve - Promise resolve function
   * @param showErrorToast - Whether to show error toast
   */
  private handleError(
    error: AxiosError<ErrorResponse>,
    resolve: (value: ApiResponse) => void,
    showErrorToast: boolean = true
  ): void {
    const errorData = error?.response?.data

    if (showErrorToast && typeof window !== 'undefined') {
      // In a real implementation, you would use a toast notification library
      console.error(errorData?.message || 'Something went wrong')
    }

    resolve({ error: errorData })
  }
}

export default new AxiosService()
