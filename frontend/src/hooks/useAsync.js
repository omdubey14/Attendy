import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useAsync = (asyncFn, dependencies = [], options = {}) => {
  const { immediate = true, onSuccess } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await asyncFn();
      setData(response);
      if (onSuccess) onSuccess(response);
      return response;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Something went wrong";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute().catch(() => {});
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
};
