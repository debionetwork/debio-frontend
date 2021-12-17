import apiClientRequest from "@/lib/api"

export async function getServiceRequestCountries() {
  const { data } = await apiClientRequest.get("/service-requests/countries")

  return data
}
