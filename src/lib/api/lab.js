import apiClientRequest from "@/lib/api"

export const sendEmailRegisteredLab = async (labId) => {
  const { data } = await apiClientRequest.post(`/email/registered-lab/${labId}` )
  return data
}
