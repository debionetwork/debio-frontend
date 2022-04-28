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
      <div class="pb-5 px-7">
        Your account will be deactivated until you stake again and your staking amount will be returned after 144 hours or 6 days
      </div>
      <div class="d-flex justify-space-between px-7 mb-2">
        <div>
          <span
            style="font-size: 12px"
          > Estimated Transaction Weight </span>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="primary"
                  size="14"
                  v-bind="attrs"
                  v-on="on"
                > mdi-alert-circle-outline
                </v-icon>
              </template>
              <span style="font-size: 10px;">Total fee paid in DBIO to execute this transaction.</span>
            </v-tooltip>
        </div>
        <span style="font-size: 12px;">
          {{ Number(fee).toFixed(4) }} DBIO
        </span>
      </div>
      <div class="d-flex justify-space-between pb-5 px-7">
        <Button @click="closeDialog" elevation="2" dark color="secondary" style="width: 147px">
          No
        </Button>
        <Button @click="handleSubmit" elevation="2" dark color="primary" style="width: 147px">
          Yes
        </Button>
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
    type: String,
    fee: Number
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
