<template>
  <v-breadcrumbs class="pl-0" :items="items" divider=">">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item :disabled="item.disabled">
        <router-link v-if="item.href" :to="createHref(item.href)" style="text-decoration:none;">
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
    },
  },
  methods: {
    /**
     * createHref
     * 
     * resolve the parameters in href if any
     */
    createHref(href) {
      const { params } = this.$route
      const paramKeys = Object.keys(params)
      let _href = href
      paramKeys.forEach(key => {
        _href = _href.replace(`:${key}`, params[key])
      })
      return _href
    }
  },
}
</script>

<style>

</style>