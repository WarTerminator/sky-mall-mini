interface WXOptions<T> {
  [key: string]: any;
  success?: (res: T) => void;
  fail?: (err: any) => void;
  complete?: () => void;
};

const DEFAULT_TIMEOUT = 6000;
export default function promisify<T>(func: (options: WXOptions<T>) => void, defaultOptions: WXOptions<T> = { timeout: DEFAULT_TIMEOUT }): (options?: Partial<WXOptions<T>>) => Promise<T> {
  return function(options?: Partial<WXOptions<T>>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const wrappedOptions: WXOptions<T> = {
        ...defaultOptions,
        ...options,
        success: (res: T) => resolve(res),
        fail: (err: any) => reject(err),
        complete: options?.complete || (() => {})
      };

      func(wrappedOptions);
    });
  };
};