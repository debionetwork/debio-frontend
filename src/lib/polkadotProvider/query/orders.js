import { queryServicesById } from './services'
import { queryLabsById } from './labs'

export async function ordersByCustomer(api, address) {
  const res = await api.query.orders.ordersByCustomer(address)
  return res.toHuman()
}

export async function getOrdersDetailByAddress(api, address) {
  let orderIds = await ordersBySeller(api, address)
  
  if(orderIds == null){
    return []
  }
  orderIds.reverse()
  
  let orders = []
  for(let i = 0; i < orderIds.length; i++){
    let orderDetail = await getOrdersDetail(api, orderIds[i])
    if(orderDetail['status'] == "Unpaid") continue // Skip unpaid orders
    
    const service = await queryServicesById(api, orderDetail.service_id)
    orderDetail['created_at'] = parseInt(orderDetail.created_at.replace(/,/g, ""))
    
    let lab = null
    if(service != null){
      orderDetail['service_name'] = service.info.name
      lab = await queryLabsById(api, service.owner_id)
    }

    if(lab != null){
      orderDetail['lab_name'] = lab.info.name
    }

    orders.push(orderDetail)
  }
  return orders
}



export async function getOrdersDetailByAddressPagination(api, address, page, pageSize) {
  page -= 1 // Reduce page counter by 1
  let beginItemIndex = page * pageSize // Get first item index of page
  let lastItemIndex = beginItemIndex + pageSize // Get last item index of page

  let orderIds = await ordersBySeller(api, address)
  if(orderIds == null){
    return {
      orders: [],
      totalOrders: 0
    } // Return empty array on null
  }
  orderIds.reverse()
  
  let orders = []
  if(lastItemIndex > orderIds.length){
    lastItemIndex = orderIds.length
  }
  for(let i = beginItemIndex; i < lastItemIndex; i++){
    let orderDetail = await getOrdersDetail(api, orderIds[i])
    if(orderDetail['status'] == "Unpaid") continue // Skip unpaid orders

    const service = await queryServicesById(api, orderDetail.service_id)
    orderDetail['created_at'] = parseInt(orderDetail.created_at.replace(/,/g, ""))
    
    let lab = null
    if(service){
      orderDetail['service_name'] = service.info.name
      lab = await queryLabsById(api, service.owner_id)
    }

    if(lab){
      orderDetail['lab_name'] = lab.info.name
    }

    orders.push(orderDetail)
  }

  return {
    orders: orders,
    totalOrders: orderIds.length
  }
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