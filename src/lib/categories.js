import axios from "axios"
const baseUrl = process.env.VUE_APP_DEV_DEBIO_BACKEND_URL

export const getCategories = async () => {
  return axios.get(`${baseUrl}/service-category`)
}
