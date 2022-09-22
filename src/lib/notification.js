import localStorage from "@/lib/local-storage"
import { getNotification } from "@/lib/api"
import store from "../store"
import { fmtReferenceFromHex } from "@/lib/string-format"

//TODO: move every route name to global
const routes = {
  "New Order": "lab-dashboard-process-order",
  "Add service": "lab-dashboard-services",
  "Account Verified": "lab-dashboard-account"
}

export async function getUnlistedNotification (roles, newBlock, lastBlock) {
  
  const role = roles.replace(roles[0], roles[0].toUpperCase())
  const from = "Debio Network"
  const toId = localStorage.getAddress()
  const { data } = await getNotification(toId, lastBlock, newBlock, role, from)
  const storageName = "LOCAL_NOTIFICATION_BY_ADDRESS_" + toId + "_" + roles;
  const reverse = data.reverse()

  let listNotification = []
  const listNotificationJson = localStorage.getLocalStorageByName(storageName);
  if (!listNotificationJson) return

  listNotification = JSON.parse(listNotificationJson)
  

  if(lastBlock >= parseInt(data[data.length-1].block_number)) return
  
  reverse.forEach(event => {
    const dateSet = new Date(event.created_at)
    const timestamp = dateSet.getTime().toString()
    const notifDate = dateSet.toLocaleString("en-US", {
      weekday: "short", // long, short, narrow
      day: "numeric", // numeric, 2-digit
      year: "numeric", // numeric, 2-digit
      month: "long", // numeric, 2-digit, long, short, narrow
      hour: "numeric", // numeric, 2-digit
      minute: "numeric"
    });

    const message = event.description.replace("[]", 
      event?.reference_id?.includes("0x") ? fmtReferenceFromHex(event.reference_id) : event.reference_id
    )
    
    listNotification.push({
      message,
      timestamp,
      route: routes[event.entity],
      params: {orderId: event.reference_id},
      block: event.block_number,
      read: event.read,
      notifId: event.id,
      notifDate
    })
  });
  
  localStorage.setLocalStorageByName(storageName, JSON.stringify(listNotification));
  store.commit("substrate/SET_LIST_NOTIFICATION", listNotification)
}

