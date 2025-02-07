import { useEffect, useMemo, useRef, useState } from 'react';

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const useIsMounted = () => {
  const mountRef = useRef(false);

  useEffect(() => {
    mountRef.current = true;
  }, []);

  return mountRef.current;
};

export const useDebouncedValue = <T = any>(value: T, wait: number) => {
  const isMounted = useIsMounted();
  const [_value, setValue] = useState(value);

  const debouncedSetValue = useMemo(() => debounce(setValue, wait), []);

  useEffect(() => {
    if (isMounted) {
      debouncedSetValue(value);
    }
  }, [value]);

  return _value;
};

export function useDebouncedState<T = any>(defaultValue: T, wait: number) {
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebouncedValue(value, wait);

  return { value, debouncedValue, setValue };
}
