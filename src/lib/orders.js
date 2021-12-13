import axios from "axios"

export const getOrdersData = async (hash, page, size, keyword = "") => {
  const { data } = await axios.get(
    `${process.env.VUE_APP_BACKEND_API}/orders/list/lab/${hash}`, {
      params: {
        keyword,
        size,
        page
      }
    }
  )
  
  return data
}