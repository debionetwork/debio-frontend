<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <v-alert
            type="success"
            >Lab Registration Success</v-alert>
          <v-card class="dg-card" elevation="0" outlined>
            <div class="secondary--text mt-5 ml-8"><b>Lab Verification</b></div>
            <v-card-text class="px-8">
                <p class="black--text">
                    We recommend that you go through the lab verification process in order to receive the verified badge
                    <v-icon 
                      inline
                      color="primary"
                      :size="16"
                    >mdi-check-decagram</v-icon>.
                    <br>
                    Otherwise, you can skip this step and do this later.
                </p>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-btn
                            color="primary"
                            block
                            medium>Verify Lab</v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-btn
                            color="primary"
                            block
                            disabled
                            medium>Skip This Step</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

export default {
  name: "Lab Registration"
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
