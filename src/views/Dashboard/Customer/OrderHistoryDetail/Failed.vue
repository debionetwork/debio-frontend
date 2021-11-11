<template>
  <v-row>
    <v-col cols="12" md="6">
      <div class="payment-failed">
        <v-row>
          <v-col cols="12">
            <v-card class="dg-card" elevation="0" outlined>
              <v-card-text class="px-8">
                <div class="payment-failed__order-detail d-flex justify-space-between">
                  <div class="payment-failed__title font-weight-bold">
                    Order Receipt
                  </div>					
                  <div class="payment-failed__date font-weight-bold">
                    Order Date: {{ formatedDate }}
                  </div>
                </div>
                <div class="payment-failed__details">
                  <div class="payment-failed__lab">
                    <v-row>
                      <v-col cols="12" lg="4">Lab Details</v-col>
                      <v-col cols="12" lg="8">
                        : {{ labDetails.info.name }}
                        <br>
                        {{ formatedAddress }}
                      </v-col>
                    </v-row>
                  </div>
                  <div class="payment-failed__product">
                    <v-row>
                      <v-col cols="12" lg="4">Product Details</v-col>
                      <v-col cols="12" lg="8">
                        :
                      </v-col>
                    </v-row>
                    <v-divider class="mt-3"></v-divider>
                    <v-row class="my-4 align-center">
                      <v-col cols="12" lg="2" class="d-flex align-center justify-center">
                        <v-icon
                          v-if="isValidIcon(serviceDetails.info.image)"
                          color="#BA8DBB"
                          :size="48"
                        >
                          {{ serviceDetails.info.image }}
                        </v-icon>
                      </v-col>
                      <v-col cols="12" lg="10">
                        <div class="payment-failed__product-title d-flex justify-space-between mb-1">
                          <div class="payment-failed__product-name font-weight-bold">{{ serviceDetails.info.name }}</div>
                          <div class="payment-failed__product-price">
                            {{ formatedPrice }} <span class="payment-failed__currency">{{ orderDetails.currency || "DAI" }}</span>
                          </div>
                        </div>
                        <div class="payment-failed__product-desc">{{ serviceDetails.info.description }}</div>
                      </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <div class="payment-failed__status-detail d-flex justify-space-between">
                      <div class="payment-failed__speciment-number font-weight-bold">
                        Specimen Number: {{ orderDetails.dnaSampleTrackingId | specimenNumber }}
                      </div>
                      <div class="payment-failed__status">
                        <StatusChip class="px-7" :status="ORDER_FAILED" />
                      </div>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <v-col cols="12" md="6">
      <div class="payment-failed">
        <v-row>
          <v-col cols="12">
            <v-card class="dg-card" elevation="0" outlined>
              <v-card-text class="px-8">
                <div class="payment-failed__order-detail d-flex justify-space-between">
                  <div class="payment-failed__title font-weight-bold">
                    Preparation was unsuccessful
                  </div>
                </div>
                <div class="payment-failed__details">
                  <span class="payment-failed__desc">
                    We are sorry to inform you that your preparation was failed on
                    {{ formatedDate }}. We have refunded the amount for the next processes.
                  </span>
                  <div class="payment-failed__product mt-8">
                    <v-row>
                      <v-col cols="12" lg="4">Product Details</v-col>
                      <v-col cols="12" lg="8">
                        :
                      </v-col>
                    </v-row>
                    <v-divider class="mt-3"></v-divider>
                    <v-row class="my-4 align-center">
                      <v-col cols="12" lg="2" class="d-flex align-center justify-center">
                        <v-icon
                          v-if="isValidIcon(serviceDetails.info.image)"
                          color="#BA8DBB"
                          :size="48"
                        >
                          {{ serviceDetails.info.image }}
                        </v-icon>
                      </v-col>
                      <v-col cols="12" lg="10">
                        <div class="payment-failed__product-title d-flex justify-space-between mb-1">
                          <div class="payment-failed__product-name font-weight-bold">{{ serviceDetails.info.name }}</div>
                          <div class="payment-failed__product-price">
                            {{ formatedPrice }} <span class="payment-failed__currency">{{ orderDetails.currency || "DAI" }}</span>
                          </div>
                        </div>
                        <div class="payment-failed__product-desc">{{ serviceDetails.info.description }}</div>
                      </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <div class="d-flex flex-column">
                      <div class="py-4 d-flex justify-space-between">
                        <span class="font-weight-bold">QC Price</span>
                        <div>
                          {{ formatedPrice }} <span class="payment-failed__currency">{{ orderDetails.currency || "DAI" }}</span>
                        </div>
                      </div>
                      <v-divider></v-divider>
                      <div class="py-4 d-flex justify-space-between">
                        <span class="font-weight-bold">Amount to Refund</span>
                        <div>
                          {{ formatedPrice }} <span class="payment-failed__currency">{{ orderDetails.currency || "DAI" }}</span>
                        </div>
                      </div>
                      <v-btn :to="{ name: 'request-test' }" depressed class="mt-6 yellow darken-2" color="primary">Create a new order</v-btn>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card class="dg-card" elevation="0" outlined>
              <v-card-text class="px-8 d-flex flex-column">
                <h3 class="mb-2">Frequently asked questions</h3>

                <div class="payment-failed__questions d-flex flex-column mt-2">
                  <router-link class="cyan--text accent-4" to="#">
                    <h4 class="font-weight-regular">What happens to my sample at the laboratory?</h4>
                  </router-link>
                  <router-link class="cyan--text accent-4" to="#">
                    <h4 class="font-weight-regular">When will my results be ready?</h4>
                  </router-link>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import StatusChip from "@/components/StatusChip"
import { ORDER_FAILED } from "@/constants/specimen-status"

export default {
  name: "RequestTestSuccess",
  components: { StatusChip },

  props: {
    labDetails: { type: Object, default: () => {} },
    orderDetails: { type: Object, default: () => {} },
    serviceDetails: { type: Object, default: () => {} }
  },

  data: () => ({
    ORDER_FAILED
  }),

  computed: {
    formatedAddress() {
      return (
        this.labDetails?.info?.address + " " +
        this.labDetails?.info?.region + ", " +
        this.labDetails?.info?.country
      )
    },

    formatedDate() {
      const dateRaw = parseInt(this.orderDetails?.createdAt.replaceAll(",", ""))

      return new Date(dateRaw).toLocaleDateString()
    },

    formatedPrice() {
      return parseFloat(
        this.orderDetails.prices[0].value.replaceAll(",", ".")
      ).toFixed(2)
    }
  },

  methods: {
    isValidIcon(icon) {
      return icon && (icon.startsWith("mdi") || icon.startsWith("$"));
    }
  }
}
</script>

<style lang="scss">
.payment-failed {
  &__order-detail {
    margin-bottom: 18px;
  }

	&__title {
		font-size: 18px;
	}

	&__desc {
    font-size: 14px;
    line-height: 16px;
	}

  &__currency {
    color: #FE008A;
    font-size: 10px;
  }

  &__status-detail {
    margin-top: 25px;
  }

  &__product-name {
    font-size: 18px;
    font-weight: 500;
    line-height: 21px;
  }

  &__product-desc {
    max-width: 300px;
    font-size: 12px;
    line-height: 14px;
  }

  &__questions {
    gap: 8px;

    a {
      width: max-content;
      text-decoration: none;
    }
  }
}
</style>