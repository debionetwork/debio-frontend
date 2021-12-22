import axios from "axios"

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

export default apiClientRequest
