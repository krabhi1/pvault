import { useState, useCallback } from "react";

export function usePromise<T, R, E extends Error = Error>(
  promise: (args: T) => Promise<R>,
) {
  const [data, setData] = useState<R>();
  const [error, setError] = useState<E>();
  const [isLoading, setIsLoading] = useState(false);
  const mutate = useCallback(async (args: T) => {
    try {
      setError(undefined);
      setData(undefined);
      setIsLoading(true);

      const data = await promise(args);
      setIsLoading(false);
      setData(data);
      setError(undefined);
    } catch (error) {
      setError(error as E);
      setData(undefined);
      setIsLoading(false);
    }
  }, []);

  return { data, error, isLoading, mutate };
}
