<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <v-card class="dg-card mb-10" elevation="0" outlined>
            <div class="secondary--text mt-5 ml-8"><b>Lab verification documents</b></div>
            <v-card-text class="px-8">
                <p class="black--text">
                    Please upload lab verification documents. Verification will take between X and Y business days.
                </p>
                
                <v-file-input
                    dense
                    label="Document 1"
                    placeholder="Document 1"
                    prepend-icon="mdi-file-document"
                    outlined
                    v-model="profileImage"
                    :rules="fileInputRules"
                ></v-file-input>
                
                <v-file-input
                    dense
                    label="Document 2"
                    placeholder="Document 2"
                    prepend-icon="mdi-file-document"
                    outlined
                    v-model="profileImage"
                    :rules="fileInputRules"
                ></v-file-input>

                <v-btn
                    color="primary"
                    block
                    medium>Submit</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'LabAccount',
  computed: {
    fileInputRules() {
      return [
        value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!',
      ]
    }
  },
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
