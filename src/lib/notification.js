import localStorage from "@/lib/local-storage"
import { getNotification } from "@/lib/api"
import store from "../store"

const routes = {
  "New Order": "lab-dashboard-process-order",
  "Add service": "lab-dashboard-services-detail"
}

export async function getUnlistedNotification (roles, newBlock, lastBlock) {
  
  const role = roles.replace(roles[0], roles[0].toUpperCase())
  const from = "Debio Network"
  const toId = localStorage.getAddress()
  const { data } = await getNotification(toId, lastBlock, newBlock, role, from)
  const storageName = "LOCAL_NOTIFICATION_BY_ADDRESS_" + toId + "_" + roles;

  let listNotification = []
  const listNotificationJson = localStorage.getLocalStorageByName(storageName);
  if (listNotificationJson) {
    listNotification = JSON.parse(listNotificationJson)    
  }
  
  data.forEach(event => {
    if(lastBlock !== parseInt(event.block_number)){
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
  
      const message = event.description.replace("[]", event.reference_id)
      
      listNotification.push({
        message,
        timestamp,
        route: routes[event.entity],
        params: event.reference_id,
        block: event.block_number,
        read: false,
        notifDate
      })
  
      localStorage.setLocalStorageByName(storageName, JSON.stringify(listNotification));
      listNotification.reverse();
  
      store.dispatch("substrate/SET_LIST_NOTIFICATION", listNotification)  
    }
  });
}

