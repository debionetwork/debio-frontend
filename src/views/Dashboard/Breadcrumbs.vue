<template>
  <v-breadcrumbs class="pl-0" :items="items" divider=">">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item :disabled="item.disabled">
        <router-link v-if="item.href" :to="item.href" style="text-decoration:none;">
          <b>{{ item.text }}</b>
        </router-link>
        <div v-else>
          {{ item.text }}
        </div>
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  computed: {
    items() {
      if (this.$route.meta && this.$route.meta.breadcrumbs) {
        return this.$route.meta.breadcrumbs
      }
      return []
    }
  }
}
</script>

<style>

</style>