<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <MenuCard
            icon="mdi-file-document-multiple-outline"
            title="Reports"
            sub-title="View your test reports"
          ></MenuCard>
        </v-col>
        <v-col cols="12" md="4">
          <MenuCard
            icon="mdi-test-tube"
            title="Request Test"
            sub-title="Get your DNA samples tested"
            @click="() => $router.push('/request-test')"
          ></MenuCard>
        </v-col>
        <v-col cols="12" md="4">
          <MenuCard
            icon="mdi-dna"
            title="Download Genome"
            sub-title="Download your genomic data"
          ></MenuCard>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MenuCard from '../../../components/MenuCard'

export default {
  name: 'Home',
  components: {
    MenuCard,
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
