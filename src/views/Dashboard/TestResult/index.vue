<template>
   <div>
      <v-container>
         <v-row>
            <v-col cols="12">
               <div class="text-h5 px-2 secondary--text text--lighten-2">
                  <b>Test Result</b>
               </div>
            </v-col>
         </v-row>
         <v-row>
            <v-col md="4" cols="12">
               <v-text-field
                  hide-details="auto"
                  label="Search"
                  outlined
                  dense
                  append-icon="mdi-magnify"
                  color="prmary"
               ></v-text-field>
            </v-col>
         </v-row>
         <v-row>
            <v-col cols="12" md="4">
               <TestResults />
            </v-col>
         </v-row>
      </v-container>
   </div>
</template>

<script>
import TestResults from './TestResults'

export default {
  name: 'test-result-all',
  components: {
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
