import axios from "axios"
const baseUrl = process.env.VUE_APP_DEV_DEGENICS_BACKEND_URL

export const getCategories = async () => {
  const categorries = axios.get(`${baseUrl}/service-category`)
  console.log("categories di lib", categorries)
  return categorries
}
