import apiClientRequest from "@/lib/api"

export const getNotification = async (to_id) => {
  return apiClientRequest.get(`/notification/${to_id}`)
}