<template>
  <v-dialog :value="show" width="450" persistent>
    <v-card>
      <div class="d-flex justify-center pb-5 pt-5">
        <v-img
          v-bind:src="require('../../assets/alert-circle.png')"
          :max-width="67"
        />
      </div>
      <div align="center" class="pb-5">
        <strong>Are you sure you want to unstake?</strong>
      </div>
      <div align="center" class="pb-5 pl-5 pr-5">
        Your account will be deactivated until you stake again and your staking amount will be returned after 144 hours or 6 days
      </div>
      <div class="d-flex justify-center pb-5">
        <v-col lg="5" md="5" sm="8">
          <Button @click="closeDialog" elevation="2" dark color="secondary">
            No
          </Button>
        </v-col>
        <v-col lg="5" md="5" sm="8">
          <Button @click="handleSubmit" elevation="2" dark color="primary">
            Yes
          </Button>
        </v-col>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import Button from "@/components/Button"
export default {
  name: "DialogDeleteConfirmation",
  components: {
    Button
  },
  props: {
    show: Boolean,
    type: String
  },
  
  methods: {
    closeDialog() {
      this.$emit("close")
    },
    handleSubmit() {
      this.$emit("submit")
    }
  }
}
</script>

<style></style>
