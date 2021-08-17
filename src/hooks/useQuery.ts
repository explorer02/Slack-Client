import { ajaxClient } from "ajaxClient";
import { useCallback } from "react";
import { useEffect, useState } from "react";

type QueryOptions<T> = {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: T) => void;
  onFailure?: () => void;
};
type QueryState<T> = {
  status: "idle" | "loading" | "error" | "success";
  data: T | undefined;
  error: Error | undefined;
};

export function useQuery<T>(
  url: string,
  options: QueryOptions<T> = { enabled: true, refetchInterval: -1 }
): QueryState<T> {
  const [state, setState] = useState<QueryState<T>>({
    status: "idle",
    data: undefined,
    error: undefined,
  });

  const { onSuccess, onFailure } = options;
  const fetchQuery = useCallback(() => {
    setState((s) => ({ ...s, status: "loading" }));
    ajaxClient
      .get<T>(url)
      .then((res) => {
        setState({ status: "success", data: res, error: undefined });
        onSuccess?.(res);
      })
      .catch((err) => {
        setState({ status: "error", data: undefined, error: err });
        onFailure?.();
      });
  }, [url, onSuccess, onFailure]);

  useEffect(() => {
    if (options.enabled === true) {
      fetchQuery();
      if (options.refetchInterval && options.refetchInterval > 0) {
        const id = setInterval(() => {
          fetchQuery();
        }, options.refetchInterval * 1000);
        return () => {
          clearInterval(id);
        };
      }
    }
  }, [fetchQuery, options.enabled, options.refetchInterval]);

  return state;
}
