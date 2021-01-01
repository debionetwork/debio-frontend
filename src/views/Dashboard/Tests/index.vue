<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="text-h5 px-2 secondary--text text--lighten-2">
            <b>Processing</b>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="text-h5 px-2 secondary--text text--lighten-2">
            <b>Processed</b>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
  
</template>

<script>
// import { mapState } from 'vuex'
const DUMMY_TESTS = [
  {
    owner:'0x345271b9c5519f7c4cb057c11c7cbdd3227b934b',
    labAccount: '0x59CbbB012ebf4A19CFd25D33e04c975Ac9e178e5', serviceCode: 'TEST-1', status: 'New'
  },
  { 
    owner: '0x345271b9c5519f7c4cb057c11c7cbdd3227b934b',
    labAccount: '0x59CbbB012ebf4A19CFd25D33e04c975Ac9e178e5', serviceCode: 'TEST-2', status: 'Sending'
  },
  {
    owner: '0x345271b9c5519f7c4cb057c11c7cbdd3227b934b',
    labAccount: '0x59CbbB012ebf4A19CFd25D33e04c975Ac9e178e5', serviceCode: 'TEST-3', status: 'Received'
  },
  {
    owner: '0x345271b9c5519f7c4cb057c11c7cbdd3227b934b',
    labAccount: '0x59CbbB012ebf4A19CFd25D33e04c975Ac9e178e5', serviceCode: 'TEST-1', status: 'Reject'
  },
  {
    owner: '0x345271b9c5519f7c4cb057c11c7cbdd3227b934b',
    labAccount: '0x59CbbB012ebf4A19CFd25D33e04c975Ac9e178e5', serviceCode: 'TEST-2', status: 'Succes'
  },
  {
    owner: '0x345271b9c5519f7c4cb057c11c7cbdd3227b934b',
    labAccount: '0x59CbbB012ebf4A19CFd25D33e04c975Ac9e178e5', serviceCode: 'TEST-3', status: 'Fail'
  },
]

export default {
  name: 'Tests',
  computed: {
  },
  data: () => ({
    tests: [],
    testsInProcess: [],
    testsProcessed: [],
  }),
  async mounted() {
    await this.getTests()
  },
  methods: {
    async getTests() {
      this.tests = DUMMY_TESTS
    },
    async getTestsInProcess() {
      const inProcess = this.tests.map(t => ['New', 'Sending', 'Received'].includes(t.status))
      console.log(inProcess)
    },
    async getTestsProcessed() {
      const processed = this.tests.map(t => ['Reject', 'Succes', 'Fail'].includes(t.status))
      console.log(processed)
    }
  }
}
</script>

<style>

</style>
