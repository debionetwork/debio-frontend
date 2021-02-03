<template>
   <component v-bind:is="cardComponent" @click="onClick">
      <v-progress-linear
         v-if="loading"
         indeterminate
         color="primary"
      ></v-progress-linear>
      <!-- <div class="fill-height d-flex">
         <div class="d-flex align-center fill-height">
            <div class="my-3 ml-5">
               <v-icon v-if="icon" color="#BA8DBB" :size="48">
                  {{ icon }}
               </v-icon>
               <v-avatar v-else>
                  <img src="../../assets/degenics-logo.png" />
               </v-avatar>
            </div>
         </div>
         <div class="pr-4" style="width: 100%; position: relative;">
            <div class="ml-5 mt-5 pr-2" style="width: 100%;">
               <div class="text-h6">
                  <b>{{ title }}</b>
               </div>
               <div class="text-caption grey--text text--darken-1">
                  {{ subTitle }}
               </div>
            </div>
            <div style="text-align: end; position: absolute; bottom: 4px; right: 16px;">
               <slot name="footer"></slot>
            </div>
         </div>
      </div> -->
      <div class="d-flex flex-column justify-space-around fill-height pr-4 py-2">
         <div class="d-flex align-center">
            <div class="my-3 ml-5">
               <v-icon v-if="icon" color="#BA8DBB" :size="48">
                  {{ icon }}
               </v-icon>
               <v-avatar v-else>
                  <img src="../../assets/degenics-logo.png" />
               </v-avatar>
            </div>
            <div class="ml-5 pr-2" style="width: 100%;">
               <div class="text-h6">
                  <b>{{ title }}</b>
               </div>
               <div class="text-caption grey--text text--darken-1">
                  {{ subTitle }}
               </div>
            </div>
         </div>
         <div style="text-align: end;">
            <slot name="footer"></slot>
         </div>
      </div>
   </component>
</template>

<script>
import EnabledMenuCard from './EnabledMenuCard'
import DisabledMenuCard from './DisabledMenuCard'

export default {
  name: 'MenuCard',
  props: {
    icon: String,
    title: String,
    subTitle: String,
    disabled: Boolean,
    loading: Boolean,
  },
  components: {
    EnabledMenuCard,
    DisabledMenuCard,
  },
  computed: {
    cardComponent() {
      return this.disabled ? 'DisabledMenuCard' : 'EnabledMenuCard'
    },
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.dg-menu-card {
   height: 120px;
   width: 100%;
}
</style>

