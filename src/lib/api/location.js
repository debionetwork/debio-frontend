import apiClientRequest from "@/lib/api"

export const getLocations = async () => {
  return apiClientRequest.get("/location")
}

export const getStates = async (countryCode) => {
  return apiClientRequest.get(`/location?country_code=${countryCode}`)
}

export const getCities = async (countryCode, stateCode) => {
  return apiClientRequest.get(`/location?country_code=${countryCode}&state_code=${stateCode}`)
}
