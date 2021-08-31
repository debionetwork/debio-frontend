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
          @click="submitServiceRequestStaking"
          :disabled="!agree || isLoading || !amount"
          :loading="isLoading"
        >
          Continue
        </v-btn>
      </v-card-actions>

      <DialogAlert
        :show="dialogAlert"
        btnText="Continue"
        textAlert="Your request has been submitted! We have sent details about your request."
        imgPath="success.png"
        imgWidth="50"
        @toggle="dialogAlert = $event"
        @close="actionAlert()"
      ></DialogAlert>
    </v-card>
  </v-dialog>
</template>


<script>
import DialogAlert from "@/components/Dialog/DialogAlert";
import { approveDaiStakingAmount, checkAllowance, sendServiceRequestStaking } from '@/lib/metamask/serviceRequest'
import { startApp, getTransactionReceiptMined } from "@/lib/metamask";
import { mapState, mapMutations } from 'vuex'
import localStorage from "@/lib/local-storage"

export default {
  name: "StakingDialog",
  components: {
    DialogAlert,
  },
  props: {
  show: Boolean,
  },
  data: () => ({
    currencyList: ['DAI'], // Currently only staking in DAI is supported
    currencyType: 'DAI',
    agree: false,
    amount: "",
    dialogAlert: false,
    isLoading: false,
    transactionStep: ''
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
    disableButton() {
      return !this.agree || this.isLoading || !this.amount
    },
    ...mapState({
      country: state => state.lab.country,
      city: state => state.lab.city,
      category: state => state.lab.category,
    }),
    ...mapMutations({
      stakingAmount: "lab/SET_STAKING_AMOUNT"
    }),
  },
  methods: {
    closeDialog() {
      this._show = false;
    },
    actionAlert() {
      this.dialogAlert = false
      this.$router.push({
        name: "service-request",
      });
    },
    async submitServiceRequestStaking() {
      this.ethAccount = await startApp();
      if (this.ethAccount.currentAccount == "no_install") {
        this.isLoading = false;
        this.password = "";
        this.error = "Please install MetaMask!";
        return
      }

      try {
        this.isLoading = true

        const stakingAmount = this.amount
        const stakingAmountAllowance = await checkAllowance(this.ethAccount.currentAccount)

        if (stakingAmountAllowance < stakingAmount) {
          const txHash = await await approveDaiStakingAmount(
            this.ethAccount.currentAccount,
            stakingAmount, // Approve only as much as needed to stake
          )
          this.stakingAmount(stakingAmount)
          await getTransactionReceiptMined(txHash)
        }

        const serviceCategory = this.category[0]
        const txHash = await sendServiceRequestStaking(
          this.ethAccount.currentAccount,
          this.country,
          this.city,
          serviceCategory,
          stakingAmount
        )
        await getTransactionReceiptMined(txHash)


        const address = localStorage.getAddress();
        const storageName = "LOCAL_NOTIFICATION_BY_ADDRESS_" + address + "_" + "customer";
        const listNotificationJson = localStorage.getLocalStorageByName(storageName);

        let listNotification = [];
        if (listNotificationJson != null && listNotificationJson != "") {
          listNotification = JSON.parse(listNotificationJson);
        }

        const dateSet = new Date();
        const timestamp = dateSet.getTime().toString();
        const notifDate = dateSet.toLocaleString("en-US", {
          weekday: "short",
          day: "numeric", 
          year: "numeric",
          month: "long", 
          hour: "numeric",
          minute: "numeric",
        });

        const notification = {
          message: "Your request has been submitted",
          timestamp: timestamp,
          data: "",
          route: "service-request",
          params: "",
          read: false,
          notifDate: notifDate,
        }
          
        listNotification.push(notification)
        localStorage.setLocalStorageByName(storageName, JSON.stringify(listNotification));
        listNotification.reverse();

        this.isLoading = false
        this.dialogAlert = true
      } catch (err) {
        console.log(err)
        this.isLoading = false
      }
    },
  }
}
</script>

<style>

</style>