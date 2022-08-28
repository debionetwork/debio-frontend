import apiClientRequest from "@/lib/api"

export const getNotification = async (toId, startBlock, endBlock, role, from) => {
  
  const { data } = await apiClientRequest.get(`/notification/${toId}`, {
    params: {
      start_block: startBlock,
      end_block: endBlock,
      role,
      from
    }
  })
  return data
} 

export const setReadNotification = async (id) => {
  const { data } = await apiClientRequest.put(`/notification/set-read/${id}`)

  return data
}

export const setBulkReadNotification = async (toId) => {
  const { data } = await apiClientRequest.put(`/notification/set-read/${toId}`)

  return data
}
