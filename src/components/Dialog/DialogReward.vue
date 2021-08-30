<template>
  <v-dialog :value="_show" width="500" persistent>
    <v-card>
      <div class="d-flex justify-center pb-5 pt-5">
        <v-img src="@/assets/reward.png" max-width="70" />
      </div>
      <div align="center" class="pb-5">
        Congrats! You have received 5 DBIO from your transaction.
        <br />
        You may stake your personal data to earn more DBIO.
      </div>
      <div class="pt-5 pl-5 pr-5 pb-5">
        <Button class="mb-3" @click="closeDialogWithStakeData" elevation="2" dark>
          {{ btnText }}
        </Button>
        <Button @click="closeDialog" elevation="2" color="#BA8DBB">
          {{ btnText1 }}
        </Button>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import Button from "@/components/Button";
import localStorage from "@/lib/local-storage"

export default {
  name: "DialogReward",
  components: {
    Button,
  },
  props: {
    show: Boolean,
    orderId: String,
  },
  data: () => ({
    textAlert: "",
    btnText: "Stake my data anonymously",
    btnText1: "Not now, maybe later",
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
      let resData = []
      let result = {
        orderId: this.orderId,
        isStake: false,
        isReject: true,
      }
      resData.push(result)
      localStorage.setLocalStorageByName('STATUS_REWARD', JSON.stringify(result))
      this.$emit("close");
    },
    closeDialogWithStakeData() {
      this._show = false
      let resData = []
      let result = {
        orderId: this.orderId,
        isStake: true,
        isReject: false,
      }
      resData.push(result)
      localStorage.setLocalStorageByName('STATUS_REWARD', JSON.stringify(result))
    }
  },
};
</script>

<style>
</style>

