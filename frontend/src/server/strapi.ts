import { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios"
import { env } from "~/env";
import { APIResponse } from "~/types/types";

axios.defaults.headers.common = {
  "Authorization": `Bearer ${env.STRAPI_TOKEN}`
}

axios.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response) {
      return Promise.reject(`${error.config?.url} ${error.message} ${typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)}`)
    }
    return Promise.reject(error);
  }
);


const strapi = {
  get: async (url: string, params?: object, options?: AxiosRequestConfig) => {
    const { data } = await axios.get(`${env.STRAPI_URL}/api/${url}`, {
      params,
      ...options
    })

    return data
  },
  insert: async (url: string, data: object, options?: AxiosRequestConfig) => {
    const { data: response } = await axios.post(`${env.STRAPI_URL}/api/${url}`, { data }, {
      ...options
    })

    return response?.data.id
  },
  update: async (url: string, id: number, data: object, options?: AxiosRequestConfig) => {
    const { data: response } = await axios.put(`${env.STRAPI_URL}/api/${url}/${id}`, { data }, {
      ...options
    })

    return response?.data
  }
}

export default strapi;