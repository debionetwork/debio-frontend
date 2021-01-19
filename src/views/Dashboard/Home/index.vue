<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <!-- <div style="height: 31.3px;"></div> -->
          <div class="secondary--text mb-2"><b>Menu</b></div>
          <div class="mb-2">
            <MenuCard
              icon="mdi-test-tube"
              title="Request Test"
              sub-title="Get your DNA samples tested"
              @click="$router.push({ name: 'request-test' })"
            ></MenuCard>
          </div>
          <div class="mb-2">
            <MenuCard
              icon="mdi-dna"
              title="Download Genome"
              sub-title="Download your genomic data"
            ></MenuCard>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <OrderHistory />
        </v-col>
        <v-col cols="12" md="4">
          <TestResults />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MenuCard from '../../../components/MenuCard'
import OrderHistory from './OrderHistory'
import TestResults from './TestResults'

export default {
  name: 'Home',
  components: {
    MenuCard,
    OrderHistory,
    TestResults,
  },
  computed: {
  },
  mounted() {
  },
  data: () => ({
  }),
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
