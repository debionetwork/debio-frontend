import apiClientRequest from "@/lib/api"

export async function getServiceRequestCountries(size, page) {
  const { data } = await apiClientRequest.get("/substrate/countries", {
    params: {
      size,
      page
    }
  })
  
  return data
}
