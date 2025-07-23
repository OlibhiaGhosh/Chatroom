import axios from '../axios/axios';
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  console.log("Inside useRefreshToken Hook")
  const refresh = async () => {
      const response = await axios.get("/api/auth/refresh-token",  {
            withCredentials: true
        });
        console.log("Full response data:", response.data);
      setAuth(prev => {
            console.log((prev));
            console.log(response.data.accessToken);
            return { ...prev, accessToken: response.data.accessToken }
      });
      console.log("Returning refreshed token:", response.data.accessToken);
      return response.data.accessToken;
    } 

  return refresh;
};

export default useRefreshToken;
