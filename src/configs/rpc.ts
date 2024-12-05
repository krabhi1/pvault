import { ClientRequestOptions, ClientResponse, hc } from "hono/client";

import { UserRouterType } from "@/app/api/user";
import { DataRouterType } from "@/app/api/data";
import { useCallback, useEffect, useState } from "react";
import { StatusCode } from "hono/utils/http-status";

export const userRpc = hc<UserRouterType>("http://localhost:3000/api/user");
export const dataRpc = hc<DataRouterType>("http://localhost:3000/api/data");

type Config<T> = {
  initial?: {
    arg: T;
    requestConfig?: ClientRequestOptions;
  };
};
export function useRpc<T, R>(
  promise: (
    arg: T,
    requestConfig?: ClientRequestOptions
  ) => Promise<ClientResponse<{ data?: R }>>,
  config: Config<T> = {}
) {
  const [data, setData] = useState<R>();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);
  const mutate = useCallback(
    async (arg: T, requestConfig?: ClientRequestOptions) => {
      try {
        setError(undefined);
        setData(undefined);
        setIsLoading(true);
        const res = await promise(arg, requestConfig);
        const { data, error } = (await res.json()) as any;
        if (res.ok) {
          setIsLoading(false);
          setData(data);
          return;
        }
        throw new Error(error?.message);
      } catch (error: any) {
        setError(error);
        setData(undefined);
        setIsLoading(false);
      }
    },
    []
  );
  useEffect(() => {
    if (config.initial) {
      mutate(config.initial.arg, config.initial.requestConfig);
    }
  }, []);
  return { data, error, isLoading, mutate };
}
