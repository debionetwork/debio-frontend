<template>
  <v-dialog :value="_show" width="500" persistent :style="'border-radius: 20px;'">
    <v-card>
      <v-app-bar flat dense color="white">
        <v-spacer></v-spacer>
        <v-btn icon @click="_show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>

      <v-card-text>
      <div class="d-flex justify-center pb-5 pt-5">
        <v-img src="@/assets/reward.png" max-width="100" />
      </div>
      <div align="center" class="pb-5 text-lg-h5">
        <b> Are you sure you want to stake your data anonymously ? </b>
      </div>
      <div class="d-flex justify-center pb-5 pt-5">
        <v-checkbox v-model="agree">
          <template v-slot:label>
            <div>
              <b>
              Yes, I have read and agree to the <a>terms and conditions</a>
              </b>
            </div>
          </template>
        </v-checkbox>
      </div>
      </v-card-text>
        <v-card-actions class="px-6 pb-4">
          <v-btn
            align="center"
            depressed
            color="primary"
            large
            width="100%"
            @click="onSubmit"
            :disabled="!agree"
          >
            Continue
          </v-btn>
        </v-card-actions>
        
        <DialogAlert
        :show="dialogAlert"
        btnText="Continue"
        textAlert="Your data has successfully staked to the market place!"
        imgPath="success.png"
        :imgWidth="50"
        @toggle="dialogAlert = $event"
        @close="closeDialog()"
      ></DialogAlert>

      </v-card>
  </v-dialog>
</template>

<script>


import DialogAlert from "@/components/Dialog/DialogAlert";

export default {
  name: "DialogStakingDataConfirmation",
  components: {
    DialogAlert
  },
  props: {
    show: Boolean,
  },
  data: () => ({
    textAlert: "",
    agree: false,
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
      this.$emit("close");
    },
    onSubmit() {
      this.dialogAlert = true
    },
  },
};
</script>

<style>
</style>

