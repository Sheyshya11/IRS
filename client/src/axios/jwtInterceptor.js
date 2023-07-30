import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const baseURL = "https://irsserver.onrender.com";
// const baseURL = "http://localhost:5000";

const accessToken = Cookies.get("token");

function isTokenExpired(token) {
  if (token) {
    let decodedData = jwt_decode(token, { header: true });
    let expirationDate = decodedData.exp;
    var current_time = Date.now() / 1000;
    if (expirationDate < current_time) {
      return false;
    }
  }
}

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

axiosInstance.interceptors.request.use(async (req) => {
  if (isTokenExpired(accessToken)) {
    return req;
  } else {
    const response = await axios.get(`${baseURL}/auth/refresh`, {
      withCredentials: true,
    });

    Cookies.set("token", response.data.accessToken);
    req.headers.Authorization = `Bearer ${response.data.accessToken}`;
    return req;
  }
});

export default axiosInstance;
