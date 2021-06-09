<template>
    <div class="ml-8 d-flex align-center" style="cursor: pointer;">
      <v-badge
        :content="notifications.length"
        :value="notifications.length"
        color="primary"
        overlap
      >
        <v-icon id="notificationBell">mdi-bell</v-icon>
      </v-badge>
        <NotificationDialog id="notificationBody" v-if="showDialog" :notificationItems="notifications" />
    </div>
</template>

<script>
import NotificationDialog from './NotificationDialog'

export default {
  name: 'NotificationInfo',
  data: () => ({
    showDialog: false,
    notifications: [
      {
        notificationTitle: 'New Order Received',
        notificationTime: '1 hour'
      },
      {
        notificationTitle: 'New Order Received',
        notificationTime: '1 hour'
      },
      {
        notificationTitle: 'New Order Received',
        notificationTime: '1 hour'
      },
      {
        notificationTitle: 'New Order Received',
        notificationTime: '1 hour'
      },
      {
        notificationTitle: 'New Order Received',
        notificationTime: '1 hour'
      },
    ]
  }),
  mounted(){
    const inst = this
    document.addEventListener("click", function(e){
      if(e.target.id == 'notificationBell'){
        inst.showDialog = !inst.showDialog
      }
      else{
        inst.showDialog = false
      }
    });
  },
  components: {
    NotificationDialog,
  },
}
</script>