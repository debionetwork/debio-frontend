import axios from "axios"

export const getOrdersData = async (hash, page, size, keyword = "") => {
  const { data } = await axios.get(
    `${process.env.VUE_APP_DEV_DEBIO_BACKEND_URL}/orders/list/lab/${hash}`, {
      params: {
        keyword,
        size,
        page
      }
    }
  )
  
  return data
}