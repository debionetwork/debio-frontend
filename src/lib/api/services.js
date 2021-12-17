import apiClientRequest from "@/lib/api"

export const getProvideRequestService = async (service) => {
  const { data } = await apiClientRequest.get("/service-requests/provideRequestService", {
    params: {
      category: service.category,
      city: service.cityName,
      regionCode: service.cityCode,
      countryCode: service.countryCode
    }
  })

  return data
}
