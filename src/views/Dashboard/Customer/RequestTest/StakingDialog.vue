<template>
  <v-dialog :value="_show" width="700" persistent>
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title"> Staking Coin Agreement </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text class="mt-4 pb-0 text-subtitle-1">
        <div >
          <div class="text-body-1 mt-4">
            <div class="mb-4"> Amount </div>
            <v-row>
              <v-col
                cols="12"
                sm="9"
                >
                <v-text-field
                  v-model="amount"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="3"
              > 
                <v-select
                  outlined
                  max="30"
                  v-model="currencyType"
                  :items="currencyList"
                  :rules="[val => !!val || 'Currency Type is Required']"
                >
                </v-select>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-card-text>
      <v-card-text class="mt-4 pb-0 mb-4">
        <div class="text-h6 mt-4 pb-0 mb-4">
          <b class="mb-4">Terms and Condition: </b>
        </div>
        <div class="text-subtitle-1">
          1. Your fund will be staked for 31 days. After this period, you will be refunded. <br>
          2. If a lab responds to your request and registers before 31 days, they will receive your funds as an incentive. <br>
          3. Upon successful transfer, you will receive [AMOUNT] DBIO tokens as a reward.
        </div>
        <v-checkbox class="mt-5" v-model="agree">
          <template v-slot:label>
            <div>
              <b>
              I have read and agree to the terms and conditions
              </b>
            </div>
          </template>
        </v-checkbox>
      </v-card-text>



      <v-card-actions class="px-6 pb-4">
        <v-btn
          depressed
          color="primary"
          large
          width="100%"
          @click="closeDialog"
          :disabled="!agree || isLoading || !amount"
        >
          Continue
        </v-btn>
      </v-card-actions>

      <DialogAlert
        :show="dialogAlert"
        btnText="Continue"
        textAlert="Your request has been submitted! We have sent details about your request."
        imgPath="success.png"
        :imgWidth="50"
        @toggle="dialogAlert = $event"
        @close="actionAlert()"
      ></DialogAlert>
    </v-card>
  </v-dialog>


</template>


<script>
import DialogAlert from "@/components/Dialog/DialogAlert";
export default {
  name: "StakingDialog",
  components: {
    DialogAlert,
  },
  props: {
  show: Boolean,
  },
  data: () => ({
    currencyList: ['DAI', 'Ethereum'],
    currencyType: 'DAI',
    agree: false,
    amount: "",
    dialogAlert: false
  }),
  computed: {
    _show: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("toggle", val);
      },
    },
  },
  methods: {
    closeDialog() {
      this._show = false;
      this.password = "";
      this.error = "";
      this.dialogAlert = true
    },
    actionAlert() {
      this.dialogAlert = false
    } 
  }
}
</script>

<style>

</style>