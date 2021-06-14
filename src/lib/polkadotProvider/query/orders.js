import { queryServicesById } from './services'
import { queryLabsById } from './labs'

export async function ordersByCustomer(api, address) {
  const res = await api.query.orders.ordersByCustomer(address)
  return res.toHuman()
}

export async function getOrdersDetailByAddress(api, address) {
  const orderIds = await ordersBySeller(api, address)
  let orders = []
  for(let i = 0; i < orderIds.length; i++){
    let orderDetail = await getOrdersDetail(api, orderIds[i])
    const service = await queryServicesById(api, orderDetail.service_id)
    const lab = await queryLabsById(api, service.owner_id)
    orderDetail['created_at'] = parseInt(orderDetail.created_at.replace(/,/g, ""))
    orderDetail['lab_name'] = lab.info.name
    orderDetail['service_name'] = service.info.name
    orders.push(orderDetail)
  }
  return orders
}

export async function getOrdersDetail(api, orderId) {
  const res = await api.query.orders.orders(orderId)
  return res.toHuman()
}

export async function ordersBySeller(api, address) {
  const res = await api.query.orders.ordersBySeller(address)
  return res.toHuman()
}

export async function escrowKey(api) {
  const res = await api.query.orders.escrowKey()
  return res.toHuman()
}

export async function lastOrderByCustomer(api, address) {
  const res = await api.query.orders.lastOrderByCustomer(address)
  return res.toHuman()
}