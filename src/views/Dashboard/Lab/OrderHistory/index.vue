<template>
  <div>
    <v-container>
      <OrderList />
    </v-container>
  </div>
</template>

<script>
import OrderList from "@/components/OrderList";

export default {
  name: "LabOrderHistory",

  components: {
    OrderList
  }
}
</script>

<style lang="scss">
</style>
