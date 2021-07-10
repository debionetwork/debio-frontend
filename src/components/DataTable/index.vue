<template>
  <v-card class="degenics-datatable-card">
    <slot name="prepend"></slot>
    <v-row>
      <!-- Search Bar -->
      <v-col cols="12" sm="8" md="9" class="pt-0">
        <slot name="search-bar"></slot>
      </v-col>

      <!-- Number of Entries Select -->
      <v-col cols="12" sm="4" md="3" class="pt-0">
        <NumOfEntriesSelect
          :value="entriesPerPage"
          @select="setEntriesPerPage"
        >
        </NumOfEntriesSelect>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-data-table
      :headers="headers"
      :items="items"
      :search="dataTableSearchVal"
      :items-per-page="entriesPerPage"
      :page.sync="page"
      @page-count="pageCount = $event"
      class="degenics-data-table"
      :class="additionalClass"
      hide-default-footer
      :custom-filter="customFilter ? customFilter : defaultFilter"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :loading="loading"
      :loading-text="computedLoadingText"
    >
      <!-- Slots for row formatting -->
      <template v-for="(slot, name) in $scopedSlots" v-slot:[name]="item">
        <slot :name="name" v-bind="item"></slot>
      </template>

      <!-- Custom Footer -->
      <template v-slot:footer>
        <div class="footer d-flex justify-space-between align-center flex-wrap">
          <div class="pagination-info">
            Showing {{ from() }} to {{ to() }} of {{ total() }} entries
          </div>
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="10"
            circle
            color="secondary"
          ></v-pagination>
        </div>
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
import NumOfEntriesSelect from './NumOfEntriesSelect'

export default {
  name: 'DataTable',
  components: {
    NumOfEntriesSelect,
  },
  props: {
    headers: Array,
    items: Array,
    searchLabel: String,
    search: String,
    additionalClass: String,
    customFilter: Function,
    sortBy: Array,
    sortDesc: Array,
    loading: Boolean,
    loadingText: String,
  },
  data: () => ({
    entriesPerPage: 10,
    page: 1,
    pageCount: 0,
  }),
  computed: {
    dataTableSearchVal: {
      get() {
        return this.search
      },
      set(val) {
        console.log(val)
        this.$emit('input', val)
      }
    },
    computedLoadingText() {
      return this.loadingText ? this.loadingText : 'Loading.. Please wait'
    }
  },
  methods: {
    setEntriesPerPage(val) {
      this.entriesPerPage = val
    },
    defaultFilter(value, search, /*item*/) {
      return value != null &&
      search != null &&
      typeof value !== 'boolean' &&
      value.toString().toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !== -1
    },
    /**
     * Footer Helper functions
     */
    from() {
      if (this.items.length == 0) {
        return 0
      }
      return this.entriesPerPage * (this.page - 1) + 1
    },
    to() {
      if (this.page * this.entriesPerPage > this.items.length) {
        return this.items.length
      }
      return this.page * this.entriesPerPage
    },
    total() {
      return this.items.length
    },
    /** ----------------- */
  }
}
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.degenics-datatable-card {
  border-radius: 8px !important;
  overflow: hidden !important;
  padding: 40px;

  box-shadow: unset !important;
  filter: drop-shadow(0px 7px 20px rgba(0, 0, 0, 0.07));
}

.degenics-data-table {
  border-radius: 8px;
  overflow: hidden;
  margin-top: 24px;

  /** BRI text-body */
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1px;
  /** */

  thead {
    background-color: $color-secondary !important;

    th {
      padding-top: 8px !important;
      padding-bottom: 8px !important;
      /* white-space: nowrap; */
      * {
        color: white !important;
        /** BRI text-body */
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.1px;
        /** */
      }
      i.v-icon.notranslate.v-data-table-header__icon:not(:hover) {
        opacity: 0.5;
      }
      &.active {
        i.v-icon.notranslate.v-data-table-header__icon {
          opacity: 1;
        }
      }
    }
  }
  .footer {
    height: 72px;

    .pagination-info {
      color: $color-text-secondary;
    }
    .v-pagination {
      button {
        font-size: 11px;
        min-width: 24px;
        height: 24px;
        outline: none;
        /* outline-color: $color-secondary; */
        &:not(.v-pagination__item--active) {
          background: $color-border;
        }
      }
      li:first-child, li:last-child {
        button {
          width: 24px;
        }
      }
    }
  }
}
</style>

