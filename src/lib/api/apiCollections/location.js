import apiClientRequest from "@/lib/api"

export const getLocations = async () => {
  return apiClientRequest.get("/location")
}

export const getStates = async (country_code) => {
  return apiClientRequest.get(`/location?country_code=${country_code}`)
}

export const getCities = async (country_code, state_code) => {
  return apiClientRequest.get(`/location?country_code=${country_code}&state_code=${state_code}`)
}
