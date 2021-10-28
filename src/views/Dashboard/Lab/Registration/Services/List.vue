<template>
    <div>
        <v-card class="dg-card mt-5" elevation="0" outlined>
            <v-card-text class="px-8 mt-5">
                <div class="d-flex justify-space-between align-center">
                <div class="secondary--text text-h6">
                    <b>Services Added</b>
                </div>
                <v-btn :disabled="!isLabAccountExist" small :dark="isLabAccountExist" color="#75DEE4" fab style="border-radius:10px;" @click="addService">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
                </div>
                <div v-if="!labAccount || labAccount.services.length == 0">
                  You don’t have any services
                </div>
                <div v-if="isLoading" class="mt-5">
                <v-skeleton-loader 
                    v-for="data in labAccount.services"
                    :key="data.idx"
                    type="list-item-three-line"
                    min-width="200"
                ></v-skeleton-loader>
                </div>
                <div v-if="labAccount && labAccount.services.length > 0 && !isLoading" class="mt-5">
                  <div
                    v-for="(service, idx) in labAccount.services"
                    :key="service.id"
                    :style="idx < (labAccount.services.length - 1) && 'border-bottom: 1px solid #555454;'"
                    class="my-3"
                  >
                    <div class="d-flex justify-space-between align-center" style="width: 100%;">
                      <div class=""><b>{{ service.info.name }}</b></div>
                      <div class="d-flex">
                          <v-icon class="mx-1" small @click="editService(service)">mdi-pencil</v-icon>
                          <v-icon class="mx-1" small @click="deleteService(service)">mdi-delete</v-icon>
                      </div>
                    </div>
                    <div>
                      <span>
                        Price     : {{ service.info.prices_by_currency[0].total_price }} {{ service.info.prices_by_currency[0].currency }}
                      </span>
                    </div>
                    <div>
                      <span>
                        Duration  :{{ service.info.expected_duration.duration }} {{ service.info.expected_duration.duration_type }}
                      </span>
                    </div>
                    <div class="mt-3 mb-3">{{ service.info.description }}</div>
                    <div v-if="service.info.test_result_sample" class="mt-3 mb-3">
                      <a :href="service.info.test_result_sample" class="support-url" target="_blank">
                        <v-icon class="mx-1" small>mdi-file-document</v-icon>
                        Test Result Sample
                      </a>
                    </div>
                  </div>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import { mapGetters } from "vuex"
import serviceHandler from "@/mixins/serviceHandler"
import { deleteService } from "@/lib/polkadotProvider/command/services"

export default {
  name: 'Service',
  
  mixins: [serviceHandler],

  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
      labAccount: 'substrate/labAccount',
      isLabAccountExist: 'substrate/isLabAccountExist',
    }),
  },

  methods: {
    addService() {
      this.$emit('add-service')
    },

    editService(service) {
      this.$emit('edit-service', service)
    },

    async deleteService(service) {
      const isConfirmed = confirm("Are you sure you want to delete this service?")
      if (isConfirmed) {
        this.$emit('delete-service', true)
        await this.dispatch(deleteService, this.api, this.pair, service.id, () => {
          if(this.labAccount.services.length == 0) {
            this.$store.state.substrate.isServicesExist = false
            this.$emit('delete-service', false)
          }
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
.support-url{
  text-decoration: none;
  color: gray;
}
</style>