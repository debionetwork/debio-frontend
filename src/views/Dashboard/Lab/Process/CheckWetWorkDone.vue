<template>
  <div style="width: fit-content;">
    <v-checkbox
      value="Wetwork"
      @change="onChecked"
      :input-value="inputValue"
      color="success"
      hide-details="true"
    >
      <template v-slot:label>
        <div class="text-h6">
          Wetwork is done
        </div>
      </template>
    </v-checkbox>
  </div>
</template>

<script>
export default {
  props: {
    isChecked: Boolean,
    disabled: Boolean,
  },
  computed: {
    inputValue() {
      return this.isChecked ? ['Wetwork'] : []
    }
  },
  methods: {
    onChecked(val) {
      this.$emit('check', val.length > 0)
    }
  }
}
</script>

<style>

</style>