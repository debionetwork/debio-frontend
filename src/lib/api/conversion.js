import apiClientRequest from "@/lib/api"

export const getConversionCache = async () => {
  const { data } = await apiClientRequest.get(`/conversion/cache`)
  return data
}
