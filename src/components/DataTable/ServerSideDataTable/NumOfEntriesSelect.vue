<template>
  <div class="d-flex align-center justify-end">
    <div> Showing </div>
    <div class="px-2 num-of-entries-select">
      <v-select
        hide-details="auto"
        :items="numOfEntriesSelect"
        v-model="numOfEntries"
        color="secondary"
        outlined
        dense
        @change="change"
      ></v-select>
    </div>
    <div>entries</div>
  </div>
</template>

<script>
export default {
  props: {
    value: [Number, String],
    change: Function,
  },
  data: () => ({
    numOfEntriesSelect: [5, 10, 15, 20]
  }),
  computed: {
    numOfEntries: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('select', val)
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';

.num-of-entries-select {
  /** Border color */
  fieldset {
    border: 2px solid $color-border;
  }
  /** border color when focused */
  .v-input--is-focused {
    fieldset {
      border: 2px solid $color-secondary !important;
    }
  }

  .v-input {
    width: 70px; 
  }
  .v-input__slot {
    background: $color-form-background !important;
    box-shadow: none !important;
    height: 48px;

    .v-select__selections {
      overflow: visible;
    }
  }
  /** outermost icon container */
  .v-input__append-inner {
    width: 20px;
    margin-top: 12px !important;
  }
}
</style>
