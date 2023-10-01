import { QueryResponse } from "./fetcher";
import axios, { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { environment } from "./env";

const refreshTokens = async (req: Request, res: Response) => {
  const response = await axios.post(
    `${environment.apiURL}/refresh`,
    undefined,
    {
      headers: {
        cookie: cookies().toString(),
      },
    }
  );

  const cookiess = response.headers["set-cookie"];
  cookiess && res.headers.set("set-cookie", cookiess.toString());
};

const handleRequest = async (
  req: Request,
  res: Response,
  request: () => Promise<AxiosResponse>
) => {
  try {
    return await request();
  } catch (error: any) {
    if (error?.response?.status === 401) {
      await refreshTokens(req, res);
      return await request();
    }
    throw error;
  }
};

export const fetcherSSR = async <T>(
  req: Request,
  res: Response,
  url: string
): Promise<QueryResponse<T>> => {
  try {
    const request = () =>
      axios.get(url, {
        headers: {
          cookie: cookies().toString(),
        },
      });

    const { data } = await handleRequest(req, res, request);

    return [null, data];
  } catch (error) {
    return [error as string, null];
  }
};
