<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="text-h5 px-2 secondary--text text--lighten-2">
            <b>Request Test Success</b>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6" md="8" xl="5">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-title class="px-8">
              <div class="text-h6">
                Your Order Receipt
              </div>
            </v-card-title>
            <v-card-text class="px-8">
              <div
                v-for="(receipt) in receipts"
                :key="receipt.txReceipt.transactionHash"
              >
                <div class="d-flex align-center fill-height mb-2">
                  <div class="my-3 ml-0">
                    <v-icon
                      v-if="isValidIcon(receipt.productDetail.icon)"
                      color="#BA8DBB"
                      :size="48"
                    >
                    {{ receipt.productDetail.icon }}
                    </v-icon>
                    <v-avatar v-else>
                      <img src="../../../assets/degenics-logo.webp" />
                    </v-avatar>
                  </div>
                  <div class="ml-5">
                    <div class="text-h6">
                      <b>{{ receipt.productDetail.serviceName }}</b>
                    </div>
                    <div class="text-caption grey--text text--darken-1">
                      {{ receipt.productDetail.description }}
                    </div>
                  </div>
                  <v-spacer></v-spacer>
                  <div class="align-self-end pb-2">
                    <span class="text-h6">
                      {{ receipt.productDetail.price }}
                    </span>
                    <span class="primary--text text-caption">
                      DGNX
                    </span>
                  </div>
                </div>
                <div :key="receipt.txReceipt.transactionHash">
                  <div> <b>Tx Hash:</b> </div>
                  <div class="text-caption grey--text text--darken-1">
                     {{ receipt.txReceipt.transactionHash }}
                  </div>
                  <div><b>Specimen Number:</b></div>
                  <div class="text-caption grey--text text--darken-1">
                     {{ receipt.specimenNumber }}
                  </div>
                </div>

              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'RequestTestSuccess',
  data: () => ({
    receipts: []
  }),
  mounted() {
    const { receipts } = this.$router.history.current.params
    this.receipts = receipts
  },
  methods: {
    isValidIcon(icon) {
      return icon && (icon.startsWith('mdi') || icon.startsWith('$'))
    }
  }
}
</script>

<style>

</style>
