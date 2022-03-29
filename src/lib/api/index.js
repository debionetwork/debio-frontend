import axios from "axios"
import * as Sentry from "@sentry/vue"
import VueRouter from "@/router"

// EXPORT API COLLECTIONS HERE
export * from "./categories"
export * from "./location"
export * from "./orders"
export * from "./service-request"
export * from "./services"

// AXIOS INSTANCE EXPORT BY DEFAULT
// PLEASE DISCUSS BEFORE YOU WANT TO EDIT THIS SCRIPT
const apiClientRequest = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_API,
  headers: { "Content-Type": "application/json" },
  auth: {
    username: process.env.VUE_APP_USERNAME,
    password: process.env.VUE_APP_PASSWORD
  }
})

const responseValidation = (response) => {
  if (String(response?.status)[0] == 4 || String(response?.status)[0] == 5) {
    VueRouter.push({ query: { error: true } })
  }
}

apiClientRequest.interceptors.response.use(
  response => {
    responseValidation(response)
    
    return response;
  },
  error => {
    Sentry.captureException(error);

    responseValidation(error)

    return Promise.reject(error);
  }
)

export default apiClientRequest
