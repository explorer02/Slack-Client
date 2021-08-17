import { ChangeEvent, useCallback, useState } from "react";

export function useInput<T extends HTMLElement & { value: string }>(
  initValue: string
): [string, (ev: ChangeEvent<T>) => void] {
  const [state, setState] = useState<string>(initValue);
  const onChange = useCallback((ev: ChangeEvent<T>): void => {
    setState(ev.target.value);
  }, []);
  return [state, onChange];
}
