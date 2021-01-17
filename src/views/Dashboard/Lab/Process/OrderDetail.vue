<template>
  <v-card v-if="product" class="dg-card pb-4">
    <v-card-title class="px-8">
      <div class="text-h6">
        Order Detail
      </div>
    </v-card-title>
    <v-card-text class="px-8">
        <v-row>
          <!-- Product Detail -->
          <v-col cols="12" md="5">
            <div class="d-flex align-center fill-height py-2 pr-2" style="height: 100px;">
              <div class="my-3 ml-0">
                <v-icon
                  v-if="product.icon"
                  color="#BA8DBB"
                  :size="48"
                >
                  {{ product.icon }}
                </v-icon>
                <v-avatar v-else>
                  <img src="@/assets/degenics-logo.webp" />
                </v-avatar>
              </div>
              <div class="ml-5">
                <div class="text-h6">
                  <b>{{ product.serviceName }}</b>
                </div>
                <div class="text-caption grey--text text--darken-1">
                  {{ product.description }}
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="7" class="d-flex align-center">
            <div>
              <div>
                <div class="text-h5">
                  Customer Account Number
                </div>
                <div class="text-caption grey--text text--darken-1">
                  {{ specimen.owner }}
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="5" class="d-flex align-center">
            <div>
              <div>
                <div class="text-h5">
                  Specimen Number
                </div>
                <div class="text-caption grey--text text--darken-1">
                  {{ specimen.number | specimenNumber }}
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="7" class="d-flex align-center">
            <div>
              <div>
                <div class="text-h5">
                  Escrow Address
                </div>
                <div class="text-caption grey--text text--darken-1">
                  {{ escrowAddress }}
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'OrderDetail',
  props: {
    product: Object,
    specimen: Object,
    escrowAddress: String,
  }
}
</script>

<style>

</style>