import { AxiosRequestConfig } from "axios";
import axios from "axios"
import { env } from "~/env";
import { APIResponse } from "~/types/types";

axios.defaults.headers.common = {
"Authorization": `Bearer ${env.STRAPI_TOKEN}`
}

const strapi = {
    get: async (url: string, filters?: object, options?: AxiosRequestConfig) => {
        const {data} = await axios.get(`${env.STRAPI_URL}/api/${url}`, {
            params: filters,
            ...options
        })

        return data
    }
}

export default strapi;