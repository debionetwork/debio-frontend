import axios from "axios"

export const getProvideRequestService = async (service) => {
  const { data } =  await axios.get(`${process.env.VUE_APP_DEV_DEBIO_BACKEND_URL}/service-requests/provideRequestService`, {
    params: {
      category: service.category,
      city: service.cityName,
      regionCode: service.cityCode,
      countryCode: service.countryCode
    }
  })

  return data
}
