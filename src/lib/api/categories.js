import apiClientRequest from "@/lib/api"

export const getCategories = async () => {
  return apiClientRequest.get("/service-category")
}
