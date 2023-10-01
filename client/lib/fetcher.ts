import axios, { AxiosError, AxiosResponse } from "axios";
import { environment } from "./env";

export type QueryResponse<T> = [error: string | null, data: T | null];

export const fetcher = async <T>(url: string): Promise<QueryResponse<T>> => {
  try {
    const request = () => axios.get(url, { withCredentials: true });
    const { data } = await handleRequest(request);

    return [null, data];
  } catch (error) {
    return [error as string, null];
  }
};

export const refreshTokens = async () => {
  await axios.post(`http://localhost:3001/refresh`, undefined, {
    withCredentials: true,
  });
};

export const handleRequest = async (
  request: () => Promise<AxiosResponse>
): Promise<AxiosResponse> => {
  try {
    return await request();
  } catch (error: any) {
    if (error?.response?.status === 401) {
      await refreshTokens();
      return await request();
    }

    throw error;
  }
};

export const poster = async <T>(
  url: string,
  payload?: unknown
): Promise<QueryResponse<T>> => {
  try {
    const request = () =>
      axios.post(url, payload, {
        withCredentials: true,
      });
    const { data } = await handleRequest(request);
    return [data, null];
  } catch (error) {
    return [error as string, null];
  }
};
