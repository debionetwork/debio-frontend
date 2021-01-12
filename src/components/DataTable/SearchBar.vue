<template>
  <div class="d-flex">
    <v-menu
      offset-y v-if="showFilter"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="bri-filter-btn"
          v-bind="attrs"
          v-on="on"
        >
          Filter By
          <v-icon right size="24">
            mdi-menu-down
          </v-icon>
        </v-btn>
      </template>
      <slot name="filter-menu"></slot>
    </v-menu>

    <v-text-field
      hide-details="auto"
      class="bri-search-field"
      :class="{ 'has-filter': showFilter }"
      :label="label"
      outlined
      dense
      append-icon="mdi-magnify"
      color="secondary"
      @input="onSearchInput"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    label: String,
  },
  computed: {
    showFilter() { // Show filter if filter-menu slot has content
      return !!this.$slots['filter-menu']
    },
  },
  data: () => ({
  }),
  methods: {
    onSearchInput(val) {
      this.$emit('input', val)
    },
  }
}
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.bri-filter-btn {
  width: 181px;
  height: 48px !important;
  border: 2px solid $color-border;
  background: $color-form-background !important;
  color: rgba(0, 0, 0, 0.6);
  box-shadow: unset;
  letter-spacing: unset !important;
  font-size: unset !important;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  i {
    color: rgba(0, 0, 0, 0.54) !important;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;
  }

  &:focus {
    border: 2px solid $color-secondary !important;
    i {
      color: $color-secondary !important;
    }
    /** Set the background to not be darkened when focus */
    &::before {
      background: $color-form-background !important;
    }
  }
}

.bri-search-field {
  max-width: 455px;
  /** Border color */
  fieldset {
    border: 2px solid $color-border;
  }
  /** Border color on focus */
  .v-input--is-focused {
    fieldset {
      border: 2px solid $color-secondary !important;
    }
  }
  /** This is the icon container */
  .v-input__append-inner {
    display: flex !important;
    height: 48px !important;
    align-items: center;
    width: 48px;
    background-color: $color-secondary;
    margin: 0 !important;
    border: 1px solid $color-secondary;
    z-index: 2;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;

    /** icon */
    i::before {
      color: white !important;
    }
  }

  .v-input__slot {
    background: $color-form-background !important;
    box-shadow: none !important;
    padding-right: 0 !important;
    border-radius: 5px;

    /** This is the label inside the input */
    .v-label {
      line-height: 28px !important;
    }
  }

  &.has-filter {
    .v-input__slot {
      border-bottom-left-radius: 0 !important;
      border-top-left-radius: 0 !important;
    }
  }
}
</style>
