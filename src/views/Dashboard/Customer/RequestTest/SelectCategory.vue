<template>
  <div>
    <v-container>
      <v-row class="pt-1">
          <v-col
            v-for="(category,i) in categories"
            :key="i"
            cols="12"
            xl="4"
            lg="4"
            md="6"
          >
            <SelectableMenuCard
              icon="mdi-dna"
              :title="category"
              :is-selected="isCategorySelected(category)"
              :disabled="isCategoryDisabled(category)"
              @click="selectOneCategory(category)"
            >
              <template v-slot:footer>
                <span class="text-h6">
                </span>
                <span class="primary--text text-caption">
                </span>
              </template>
            </SelectableMenuCard>
            
          </v-col>
      </v-row>
    </v-container>
  </div>
  
</template>

<script>
import SelectableMenuCard from "@/components/SelectableMenuCard";
import categories from '@/constants/categories'


export default {
  name: 'SelectCategory',
  data: () => ({
    categories: [],
    selectedCategory: [],
  }),
  components: {
    SelectableMenuCard
  },
  async mounted() {
    this.categories = categories
  },
  methods: {
    isCategorySelected(category) {
      if (category == this.selectedCategory[0]) {
        return true
      }
      return false
    },
    isCategoryDisabled(category) {
      if (this.selectedCategory.length == 0) {
        return false
      }
      return this.selectedCategory[0] != category
    },
    selectOneCategory(category) {
        if (this.selectedCategory.length == 0) {
          this.selectedCategory = [category];
          this.getLab ()
          return this.$router.push({ name: 'select-lab' })
        }
        if (
        this.selectedCategory.length > 0
      ) {
        this.selectedCategory = [];
      }
    },
    async getLab() {
      const category = this.selectedCategory
      await this.$store.dispatch("lab/getLabByCategory", category);
    },
    
  }
}
</script>

<style>

</style>