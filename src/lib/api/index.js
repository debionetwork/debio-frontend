import axios from "axios"
import * as Sentry from "@sentry/vue"
import VueRouter from "@/router"
import getEnv from "../../utils/env"

// EXPORT API COLLECTIONS HERE
export * from "./categories"
export * from "./location"
export * from "./orders"
export * from "./service-request"
export * from "./services"
export * from "./conversion"
export * from "./dna-collection-process"
export * from "./notification"

// AXIOS INSTANCE EXPORT BY DEFAULT
// PLEASE DISCUSS BEFORE YOU WANT TO EDIT THIS SCRIPT
const apiClientRequest = axios.create({
  baseURL: getEnv("VUE_APP_BACKEND_API"),
  headers: { "Content-Type": "application/json" },
  auth: {
    username: getEnv("VUE_APP_USERNAME"),
    password: getEnv("VUE_APP_PASSWORD")
  }
})

const responseValidation = (response) => {
  if (response?.status === 503) VueRouter.push({ name: "maintenance" })
  else if (String(response?.status)[0] === "4" || String(response?.status)[0] === "5") {
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

    responseValidation(error.response)

    return Promise.reject(error);
  }
)

export default apiClientRequest
