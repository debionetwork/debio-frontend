<template>
  <v-dialog :value="show" width="340" persistent>
    <v-card class="pb-5">
      <v-app-bar flat dense color="white">
        <v-toolbar-title />
        <v-spacer />
        <v-btn icon @click="closeDialog">
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-app-bar>
      <div class="mt-10 mb-10" align="center">
        <div> 
          <div align="center" >
            <div style="font-size: 20px"> {{ title }} </div>
            <v-img class="mt-5 mb-3" src="@/assets/metamask-icon.png" max-width="80" /> 
            <span class="grey--text"> Metamask </span>
          </div>
          <div align="center" class="mt-5 grey--text"> Haven't got a metamask wallet yet ? </div>
          <div align="center" class="mt-5">
            <a href="https://docs.debio.network/getting-started" target="_blank" rel="noreferrer noopener nofollow"> <u> Learn How to Install and Connect </u> </a>
          </div>
          <div class="mb-5 ml-8 mr-8 mt-8">
            <ui-debio-button 
              class="mt-5 align-center"
              color="secondary"
              :loading="loading"
              @click="onClick"
            > {{ button }}
            </ui-debio-button>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: "InstallMetamask",

  props: {
    show: Boolean,
    button: String,
    title: String,
    loading: Boolean
  },

  methods: {
    onClick() {
      if (this.button === "Install") {
        window.open("https://metamask.io/download/", "_blank", "noopener")
        return
      }
      this.$emit("onClick")
    },

    closeDialog() {
      this.$emit("close")
    }
  }
}
</script>
