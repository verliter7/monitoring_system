import { useState, useCallback } from 'react';
import { useMount } from '.';
import { HttpReqType, HttpReqDataType } from '@/utils/HttpReq/type';

type Result<D, P extends any[] = any[]> = {
  reqRes?: HttpReqDataType<D>;
  error?: Error;
  loading: boolean;
  run: (...params: P) => void;
};
type Options<D, P extends any[] = any[]> = {
  manual: boolean;
  defaultParams: P;
  onBefore: (...params: P) => void;
  onSuccess: (reqRes: HttpReqDataType<D>, ...params: P) => void;
  onError: (error: Error, ...params: P) => void;
  onFinally: (reqRes?: HttpReqDataType<D>, e?: Error, ...params: P) => void;
};

const useRequest = <D = any, P extends any[] = any[]>(
  request: HttpReqType<D, P>,
  options?: Partial<Options<D, P>>,
): Result<D, P> => {
  const { manual = false, defaultParams, onBefore, onSuccess, onError, onFinally } = options ?? {};
  const [reqRes, setReqRes] = useState<HttpReqDataType>();
  const [loading, setLoaing] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const completeRequest = async (defaultParams?: P) => {
    const params = (defaultParams ?? []) as P;

    onBefore?.(...params);
    setLoaing(true);

    try {
      const res = await request(...params);

      onSuccess?.(res, ...params);
      onFinally?.(res, void 0, ...params);
      setReqRes(res);
      setLoaing(false);
    } catch (e) {
      const error = e as Error;

      onError?.(error, ...params);
      onFinally?.(void 0, error, ...params);
      setError(error);
      setLoaing(false);
    }
  };
  const run = useCallback((...params: P) => {
    completeRequest(params);
  }, []);

  useMount(() => {
    manual === false && completeRequest(defaultParams);
  });

  return { reqRes, error, loading, run };
};

export default useRequest;
