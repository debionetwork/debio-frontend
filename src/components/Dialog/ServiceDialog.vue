<template>
  <v-dialog :value="_show" width="693" persistent>
    <v-card>
      <v-app-bar flat dense color="white">
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <div class="d-flex justify-center pb-5 pt-5">
        <div class="text-lg-h5 grey--text">
          <b> {{ serviceName }} </b>
        </div>
      </div>
      <div class="d-flex justify-center pb-5 pt-3">
        <v-icon color="#BA8DBB" :size="125">
          {{ icon }}
        </v-icon>
      </div>

      <div class="ml-5 pb-5">
        <div>
          <div class="grey--text text-h6">
            Description
          </div>
          <div class="pt-5 pl-5 pr-5 pb-5 text-h6">
            {{ description }}
          </div>
        </div>
        <div class="grey--text text-h6">
          Duration
        </div>
        <div class="pt-5 pl-5 pr-5 pb-5 text-h6">
          This service is expected to be completed within {{ duration }}
          </div>
      </div>
      <div class="pt-5 pl-5 pr-5 pb-5">
        <Button class="mb-3" @click="downloadFile" elevation="2" color="#BA8DBB" >
          Download Sample Report
        </Button>
        <Button @click="onSubmit" elevation="2" dark>
          Select this Service
        </Button>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import Button from "@/components/Button";
import { downloadDecryptedFromIPFS } from "@/lib/ipfs";
import { hexToU8a } from "@polkadot/util";
import { mapState } from 'vuex';


export default {
  name: "ServiceDialog",
  components: {
    Button,
  },
  props: {
    show: Boolean,
    orderId: String,
    icon: String,
    serviceName: String,
    description: String,
    duration: String,
    downloadPath: String,
    serviceId: String
  },
  computed: {
    _show: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("toggle", val);
      },
    },
    ...mapState({
      mnemonicData: (state) => state.substrate.mnemonicData,
    })
  },
  methods: {
    closeDialog() {
      this._show = false;
      this.$emit("close");
    },
    async downloadFile() {
      const publicKey = hexToU8a(this.mnemonicData.publicKey);
      const privateKey = hexToU8a(this.mnemonicData.privateKey);
      const baseUrl = "https://ipfs.io/ipfs/";
      const path = this.downloadPath.replace(baseUrl, "")
      await downloadDecryptedFromIPFS(
        path,
        privateKey,
        publicKey,
        this.serviceId + ".pdf",
        "application/pdf"
      );
    },
    onSubmit() {
      this.$router.push({ name: "request-test-checkout" });
    }
  },
};
</script>

<style>
</style>

