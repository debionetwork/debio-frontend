import axios from 'axios'

export async function getServiceRequestCountries() {
  const baseUrl = process.env.VUE_APP_DEV_DEGENICS_BACKEND_URL
  const resp = await axios.get(`${baseUrl}/service-requests/countries`)
  return resp.data
}