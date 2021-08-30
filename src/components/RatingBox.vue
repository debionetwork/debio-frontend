<template>
  <div>
    <v-card class="dg-card" elevation="0" outlined align="center">
      <v-card-title class="px-8 p4">
        <div class="text-h6" align="center">Please tell us how was your experience!</div>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="px-16" align="center">
            <v-rating
              v-model="rate"
              empty-icon="mdi-star-outline"
              full-icon="mdi-star"
              hover
              length="5"
              size="48"
            ></v-rating>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              size="20"
              outlined
              name="input-7-1"
              v-model="comment"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row class="justify-center mt-10 align-center">
          <v-col cols="12" lg="5" md="5" sm="8" align="center">
            <Button
              color="primary"
              elevation="2"
              @click="sendFeedback"
              dark
            >
              <div class="white--text">Send FeedBack</div>
            </Button>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-8 pb-5">
        <slot name="button"> </slot>
      </v-card-actions>
    </v-card>

   <DialogAlert
      :show="dialogAlert"
      btnText="Continue"
      titleAlert="Thank you!"
      textAlert="Your feedback has been sent"
      imgPath="success.png"
      imgWidth="50"
      @toggle="dialogAlert = $event"
      @close="actionAlert()"
    ></DialogAlert>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Button from "@/components/Button";
import DialogAlert from '@/components/Dialog/DialogAlert'
export default {
  name: "RatingBox",
  props: {
    orderId: String,
    order: Object,
  },
  data: () => ({
    rate: 0,
    comment: "",
    dialogAlert: false,
    lab_id: "",
    service_id: "",
    customer_id: "",
    date: "",
  }),
  computed: {
    ...mapState({
      rate: (state) => state.feedback.rate,
      comment: (state) => state.feedback.comment
    }),
  },
  components: {
    Button,
    DialogAlert
  },
  methods: {
    async sendFeedback () {
      await this.getDate()
      const { rate, comment, lab_id, service_id, customer_id, createdAt, orderId } = this
      this.$store.dispatch('feedback/sendFeedback', {
        rate, 
        comment,
        lab_id,
        service_id,
        customer_id,
        createdAt,
        orderId
        })
      this.dialogAlert = true
    },
    async actionAlert() {
      this.$router.push({
        name: "order-history"
      });
    },

    async getDate() {
      const dateNow = new Date()
      let day = dateNow.getDate()
      let month = dateNow.getMonth()
      let year = dateNow.getFullYear()
      let hour = dateNow.getHours()
      let minute = dateNow.getMinutes()
      let second = dateNow. getSeconds()
      this.createdAt = (year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second)
    }
  },
  mounted() {
    this.lab_id = this.order.seller_id
    this.service_id = this.order.service_id
    this.customer_id = this.order.customer_id
  },
}
</script>

<style>

</style>