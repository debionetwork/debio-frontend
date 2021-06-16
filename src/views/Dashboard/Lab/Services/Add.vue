<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
            <v-card class="dg-card" elevation="0" outlined>
              <v-form ref="addServiceForm">
                <v-card-text class="px-8 pb-8 pt-10">              
                    <v-text-field
                      dense
                      label="Service Name"
                      placeholder="Service Name"
                      outlined
                      v-model="name"
                      :rules="[val => !!val || 'Name is Required']"
                    ></v-text-field>
                    
                    <v-text-field
                      dense
                      label="Price (DAIC)"
                      placeholder="Price"
                      type="number"
                      max="30"
                      outlined
                      v-model="price"
                      :rules="[val => val <= 30 || 'Max Price is 30 DAIC']"
                    ></v-text-field>

                    <v-text-field
                      dense
                      label="Description"
                      placeholder="Description"
                      outlined
                      v-model="description"
                      :rules="[val => !!val || 'Description is Required']"
                    ></v-text-field>
                    
                    <v-textarea
                      label="Long Description"
                      placeholder="Long Description"
                      outlined
                      v-model="longDescription"
                    ></v-textarea>
                        
                    <!--
                    <v-file-input
                      dense
                      label="Image"
                      placeholder="Image"
                      prepend-icon="mdi-image"
                      outlined
                      v-model="files"
                    ></v-file-input>
                    -->

                    <v-btn
                      color="primary"
                      block
                      large
                      :loading="isLoading"
                      @click="createService"
                    >Submit</v-btn>
                </v-card-text>
              </v-form>
            </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createService } from '@/lib/polkadotProvider/command/services'

export default {
  name: 'AddLabServices',
  data: () => ({
    name: '',
    price: '',
    description: '',
    longDescription: '',
    files: [],
    isLoading: false
  }),
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
  },
  methods: {
    async createService() {
      if (!this.$refs.addServiceForm.validate()) {
        return
      }
      this.isLoading = true
      await createService(
        this.api,
        this.pair,
        {
          name: this.name,
          price: this.price,
          description: this.description,
          long_description: this.longDescription
        }
      )
      // Wait for transaction to finish before refreshing Vuex store
      // FIXME: Should use subscription to substrate 
      await (async () => {
        return new Promise(resolve => setTimeout(resolve, 3000));
      })()
      this.isLoading = false
      await this.$store.dispatch('substrate/getLabAccount')
      this.$router.push('/lab/services')
    },
  },
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
