import axios from 'axios'

export async function getServiceRequestCountries() {
  const baseUrl = process.env.VUE_APP_BACKEND_API
  const resp = await axios.get(`${baseUrl}/service-requests/countries`)
  return resp.data
}