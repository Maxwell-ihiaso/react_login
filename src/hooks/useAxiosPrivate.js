import React, { useEffect } from "react";
import useAuth from "./useAuth";
import useRefresh from "./UseRefresh";
import { AxiosPrivate } from "../api/axios";

const useAxiosPrivate = () => {
  const auth = useAuth();
  const refresh = useRefresh();

  useEffect(() => {
    const requestIntercept = AxiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = AxiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return AxiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      AxiosPrivate.interceptors.request.eject(requestIntercept);
      AxiosPrivate.interceptors.request.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return AxiosPrivate;
};

export default useAxiosPrivate;
