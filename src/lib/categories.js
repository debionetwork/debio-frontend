import axios from "axios"
const baseUrl = process.env.VUE_APP_BACKEND_API

export const getCategories = async () => {
  return axios.get(`${baseUrl}/service-category`)
}
