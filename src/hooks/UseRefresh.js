import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefresh = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get("/refresh");
      setAuth((prev) => ({
        ...prev,
        auth: response?.data?.accessToken,
        roles: response?.data?.roles,
      }));
      return response?.data?.accessToken;
    } catch (error) {
      if (!error?.response) console.log("No server response");
      console.error(error);
      return error;
    }
  };
  return refresh;
};

export default useRefresh;
