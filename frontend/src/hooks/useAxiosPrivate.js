import { axiosPrivate } from "../axios/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest._retry) {
          try {
            prevRequest._retry = true;
            const newAccessToken = await refresh();
            console.log(`New access token: ${newAccessToken}`);
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            console.log(
              "On regenerating access token , Request.headers['Authorization']:",
              prevRequest.headers["Authorization"]
            );
            return axiosPrivate(prevRequest);
          } catch (err) {
            // if refresh itself failed, force logout
            navigate("/login");
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
