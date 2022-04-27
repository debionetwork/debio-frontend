<template>
  <v-dialog :value="show" width="500" persistent>
    <v-card>
      <div class="d-flex justify-center pb-5 pt-5">
        <v-img
          v-bind:src="require('../../assets/alert-circle.png')"
          :max-width="67"
        />
      </div>
      <div align="center" class="pb-5">
        <strong>Are you sure you want delete this {{ type }}?</strong>
          <div class= "d-flex justify-space-between mt-3 px-16" >
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
    type: String,
    fee: { type: [String, Number]}
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
