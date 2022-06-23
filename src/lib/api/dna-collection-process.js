import apiClientRequest from "@/lib/api"

export const getDNACollectionProcess = async () => {
  return apiClientRequest.get("/dna-collection-process")
}
