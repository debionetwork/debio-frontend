<template>
  <div>
    <v-card class="dg-card mt-5" elevation="0" outlined>
      <div class="d-flex px-1">
        <v-icon class="mx-2" color="yellow" align="center">mdi-alert-circle</v-icon>
        <v-card-text class="px-1">This specimen has been rejected</v-card-text>
      </div>
    </v-card>


      <template class="mx-5">
        <v-card class="dg-card my-5 px-5 pb-3" elevation="0" outlined>
          <v-card-title>
              Message Details
          </v-card-title>
          <div class="my-2" >
            <v-card-text class="py-0 text-caption grey--text text--darken-1">Title</v-card-text>
            <v-card-text class="py-0">{{ messageTitle }}</v-card-text>
          </div>
          <div class="my-2" >
            <v-card-text class="py-0 text-caption grey--text text--darken-1">Reason of Rejection</v-card-text>
            <v-card-text class="py-0">Bad Sample Quality</v-card-text>
          </div>
          <div class="my-2">
            <v-card-text class="py-0 text-caption grey--text text--darken-1">Description</v-card-text>
            <v-card-text class="py-0">{{ messageDescription }}</v-card-text>
          </div>
        </v-card>
      </template>

  </div>
</template>

<script>
export default {
  name: "SpecimenRejected",
  props: {
    rejectMessage: Object,
  },
  data: () => ({
    messageTitle: "",
    messageDescription: "",
  }),
  mounted(){
    this.getMessageDetail()
  },
  methods: {
    getMessageDetail() {
      console.log('masuk ke mounted')
      console.log(this.rejectMessage)
      this.messageTitle = this.rejectMessage.title
      this.messageDescription = this.rejectMessage.description
      console.log(this.messageTitle, 'titile msg')
      console.log(this.messageDescription, 'description msg')
    },
  },
}
</script>

<style>

</style>