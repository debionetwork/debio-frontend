import axios from "axios"
const baseUrl = "https://backend-dev.debio.network"

export const getLocations = async () => {
  return axios.get(`${baseUrl}/location`)
}

export const getStates = async (country_code) => {
  return axios.get(`${baseUrl}/location?country_code=${country_code}`)
}

export const getCities = async (country_code, state_code) => {
  return axios.get(`${baseUrl}/location?country_code=${country_code}&state_code=${state_code}`)
}
