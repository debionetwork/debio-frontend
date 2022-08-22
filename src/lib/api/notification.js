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
