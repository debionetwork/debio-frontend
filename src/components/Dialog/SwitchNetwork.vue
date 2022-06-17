<template>
  <v-dialog :value="show" width="523" persistent>
    <v-card class=" pa-6">
      <h3 class="text-center"> Wrong Network </h3>
      <p class="text-center mt-5" > You need to connect your Metamask to 
        <strong> {{ networkName }} </strong>
        to use this app, currently you are connected to 
        <strong> {{ currentNetwork }} </strong>
      </p>

      <Button
        class="align-center"
        color="secondary"
        @click="onClick"
      >
        Connect to {{ networkName }}
      </Button>
    </v-card>
  </v-dialog>
</template>

<script>
import Button from "@/components/Button"

export default {
  name: "SwitchNetwork",

  props: {
    show: Boolean,
    networkName: String,
    currentNetwork: String
  },

  components: {
    Button
  },

  methods: {
    onClick() {
      this.$emit("click")
    }
  }
}
</script>
