import { useState, useCallback } from 'react';

// Define the type for HTTP request options (can be extended based on your use case)
interface RequestOptions {
  method?: string;
  headers?: { [key: string]: string };
  body?: string | FormData;
}

interface UseHttpReturn<T> {
  isLoading: boolean;
  error: string | null;
  sendRequest: (url: string, options?: RequestOptions) => Promise<T>;
}

const useHttp = <T = any>(): UseHttpReturn<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sendRequest = useCallback(async (url: string, options: RequestOptions = {}): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Request failed!');
      }
      const data: T = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      setError((err as Error).message || 'Something went wrong!');
      setIsLoading(false);
      throw err; 
    }
  }, []);

  return { isLoading, error, sendRequest };
};

export default useHttp;
