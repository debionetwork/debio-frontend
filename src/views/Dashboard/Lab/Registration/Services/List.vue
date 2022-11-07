<template>
  <div>
    <DialogErrorBalance :show="isShowError" @close="closeDialog" />
    <v-card class="dg-card mt-5" elevation="0" outlined>
      <v-card-text class="px-8 mt-5">
        <div class="d-flex justify-space-between align-center">
          <div class="secondary--text text-h6">
            <strong>Services Added</strong>
          </div>
          <v-btn
            :disabled="!isLabAccountExist"
            small
            :dark="isLabAccountExist"
            color="#75DEE4"
            fab
            style="border-radius: 10px"
            @click="addService"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <div v-if="!labAccount || labAccount.services.length == 0">
          You don’t have any services
        </div>
        <div v-if="isLoading" class="mt-5">
          <v-skeleton-loader
            v-for="data in services"
            :key="data.idx"
            type="list-item-three-line"
            min-width="200"
          ></v-skeleton-loader>
        </div>
        <div
          v-if="labAccount && labAccount.services.length > 0 && !isLoading"
          class="mt-5"
        >
          <div
            v-for="(service, idx) in services"
            :key="service.id"
            :style="idx < labAccount.services.length - 1 && 'border-bottom: 1px solid #555454'"
            class="my-3"
          >
            <div
              class="d-flex justify-space-between align-center"
              style="width: 100%"
            >
              <div class="">
                <strong>{{ service.info.name }}</strong>
              </div>
              <div class="d-flex">
                <v-icon class="mx-1" small @click="editService(service)"
                  >mdi-pencil</v-icon
                >
                <v-icon class="mx-1" small @click="toggleDelete(service)"
                  >mdi-delete</v-icon
                >
              </div>
            </div>
            <div>
              <span>
                Price : 
                {{ priceByCurrency(String(service.info.pricesByCurrency[0].totalPrice.replaceAll(",","")), service.info.pricesByCurrency[0].currency) }}
              </span>
            </div>
            <div>
              <span>
                Duration : {{ service.info.expectedDuration.duration }}
                {{ service.info.expectedDuration.durationType }}
              </span>
            </div>
            <div class="mt-3 mb-3">{{ service.info.description }}</div>
            <div v-if="service.info.testResultSample" class="mt-3 mb-3">
              <button
                class="support-url"
                @click="handleOpenResultSample(service.info.testResultSample)"
              >
                <v-icon class="mx-1" small>mdi-file-document</v-icon>
                {{
                  service.documentName ||
                  `${service.info.name} Test result sample`
                }}
              </button>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <DialogDelete
      :fee="fee"
      :show="deleteConfirmation"
      type="service"
      @close="toggleDelete"
      @submit="deleteService"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import serviceHandler from "@/mixins/serviceHandler"
import { deleteService, deleteServiceFee } from "@/lib/polkadotProvider/command/services"
import DialogDelete from "@/components/Dialog/DialogDeleteConfirmation"
import { getIpfsMetaData } from "@/lib/pinata-proxy"
import DialogErrorBalance from "@/components/Dialog/DialogErrorBalance"

export default {
  name: "Service",

  mixins: [serviceHandler],

  components: {
    DialogErrorBalance,
    DialogDelete
  },

  data: () => ({
    deleteConfirmation: false,
    service: null,
    services: null,
    isShowError: false,
    fee: 0
  }),

  computed: {
    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet",
      labAccount: "substrate/labAccount",
      isLabAccountExist: "substrate/isLabAccountExist"
    }),

    ...mapState({
      web3: (state) => state.metamask.web3
    })
  },

  watch: {
    labAccount: {
      deep: true,
      immediate: true,
      handler: async function (value) {
        const servicesTmp = []
        if (!value?.services) return

        for (const service of value.services) {
          const { rows } = await getIpfsMetaData(service.info.testResultSample.split("/").pop())
          servicesTmp.push({ ...service, documentName: rows[0].metadata.name })
        }

        this.services = servicesTmp
      }
    }
  },

  methods: {
    addService() {
      this.$emit("add-service")
    },

    editService(service) {
      this.$emit("edit-service", service)
    },

    handleOpenResultSample(link) {
      const a = document.createElement("a")
      a.target = "_blank"
      a.rel = "noreferrer noopener nofollow"
      a.href = link
      a.click()
    },

    async toggleDelete(service) {
      if (service) {
        this.service = service
        this.deleteConfirmation = true
      } else {
        this.service = null
        this.deleteConfirmation = false
      }

      await this.getDeleteFee()
    },

    async getDeleteFee() {
      const fee = await deleteServiceFee(this.api, this.pair, this.service.id)
      this.fee = this.web3.utils.fromWei(String(fee.partialFee), "ether")
    },

    closeDialog() {
      this.isShowError = false
    },

    async deleteService() {
      const service = this.service

      try {
        this.$emit("delete-service", true)
        await this.dispatch(deleteService, this.api, this.pair, service.id, () => {
          this.isLoading = false
          this.deleteConfirmation = false
          if (this.labAccount.services.length == 0) {
            this.$store.state.substrate.isServicesExist = false
            this.$emit("delete-service", false)
          }
        })
        this.$emit("delete-service", false)
      } catch (err) {
        if (err.message === "1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low") {
          this.isShowError = true
        }
      }
    },

    priceByCurrency(amount, currency) {
      let price = 0
      if (currency === "USDT") {
        price = Number(amount) / Math.pow(10, 6)
      } else {
        price = this.web3.utils.fromWei(String(service.info.pricesByCurrency[0].totalPrice.replaceAll(",","")), "ether")
      }
      
      return `${price} ${currency}`
    }
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
.support-url {
  text-decoration: none;
  color: gray;
}
</style>
