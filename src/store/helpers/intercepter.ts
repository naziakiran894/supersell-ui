import axios, { AxiosHeaders, AxiosError ,ResponseType } from "axios";

export type AxiosBaseQueryArgs = {
  url: string;
  method: string;
  data?: any;
  params?: any;
  headers?: AxiosHeaders;
  responseType?: ResponseType;
};

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers ,responseType }: AxiosBaseQueryArgs) => {
    
    const auth = await localStorage.getItem("persist:Authuser");
    const token = await localStorage.getItem("authToken");

    const authObj = JSON.parse(auth ? auth : "{}");
    const user = authObj.user ? JSON.parse(authObj.user) : null;

    try {
      const result = await axios({
        url: `${baseUrl}` + url,
        method,
        data,
        params,
        headers: {
          "x-access-token": token ? token : "",
          ...headers,
        },
        responseType
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          status: err?.response?.status,
          data: err?.response?.data || err.message,
        },
      };
    }
  };
