import axios from "axios";
import Cookies from "js-cookie";
import router from "@/router";

// Buat instance (lebih clean daripada pakai axios global)
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  },
});

// 🔥 Request interceptor (kirim token setiap request)
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 Response interceptor (tangani 401 global)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // hapus token
      Cookies.remove("token");

      // hindari redirect loop
      if (router.currentRoute.value.name !== "login") {
        router.push({ name: "login" });
      }
    }

    return Promise.reject(error);
  },
);

// import axios from 'axios'
// import Cookies from 'js-cookie'

// const token = Cookies.get('token')

// axios.defaults.baseURL = 'http://localhost:8000/api'
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'
// axios.defaults.headers.common['Accept'] = 'application/json'
// axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

// axios.interceptors.request.use(
//   config => {
//     const token = Cookies.get('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }

//     return config
//   },
// )

// export const axiosInstance = axios
