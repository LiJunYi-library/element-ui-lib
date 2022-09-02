import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'

declare type FetchConfig<T> = {
  baseURL?: string,
  interceptRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig,
  exitCode?: number,
  successCode?: number,
  timeout?: number,
  withCredentials?: boolean,
  setCode?: (res: T) => number,
  setMessage?: (res: T) => string,
  isShowMessage?: boolean,
  isShowErrMessag?: boolean,
  returnRes?: (res: AxiosResponse) => AxiosResponse | T,
}

declare type RequestConfig<T> = {
  isShowLoad?: boolean
  isShowMessage?: boolean
  loadOptions?: Record<string, unknown>
  messageText?: string
  errMessageText?: string
  messageType?: undefined
  returnRes?: (res: AxiosResponse) => AxiosResponse | T,
} | undefined


interface RequestInstance<T> {
  (config: AxiosRequestConfig, params: RequestConfig<T>): Promise<T>;
  get(url: string, data?: any, params?: RequestConfig<T>): Promise<T>;
  put(url: string, data?: any, params?: RequestConfig<T>): Promise<T>;
  post(url: string, data?: any, params?: RequestConfig<T>): Promise<T>;
  uploadFile(url: string, data?: any, params?: RequestConfig<T>): Promise<T>;
  getFile(url: string, data?: any, filename?: string, params?: RequestConfig<T>): Promise<T>;
}

declare interface Fetch {
  create: <T >(config: FetchConfig<T>) => RequestInstance<T>
}

declare const Fetch: Fetch;
export default Fetch;
export { FetchConfig, AxiosRequestConfig, AxiosResponse }







