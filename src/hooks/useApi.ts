// src/hooks/useApi.ts
import { useState, useEffect } from 'react';
import api from '../services/api';  // ← Changé : import default, pas { api }

export function useApi<T>(endpoint: string, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    setLoading(true);
    api.get<T>(endpoint)  // ← api direct, pas api.api
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          setError(null);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setError(err.response?.data?.message || err.message || "Une erreur est survenue");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    
    return () => {
      isMounted = false;
    };
  }, [endpoint, ...dependencies]);

  return { data, loading, error, refetch: () => {
    setLoading(true);
    api.get<T>(endpoint)
      .then((res) => {
        setData(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  } };
}