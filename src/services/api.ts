import axios, { AxiosRequestConfig } from "axios"
import { BASE_WEB_API_URL } from "@/constants/routes"
import { getSessionToken } from "@/lib/session"
import { ApiResponse } from "./interfaces"

export const axiosApi = axios.create({
  baseURL: BASE_WEB_API_URL,
  headers: {
    "Content-Type": "application/json",
    authorization: getSessionToken(),
  },
})

export async function postRequest<T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return axiosApi.post(url, data, { ...config })
}

export async function getRequest<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return axiosApi.get(url, { ...config })
}

export async function putRequest<T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return axiosApi.put(url, data, { ...config })
}
