<template>
  <v-row>
    <v-col>
      <v-btn
        @click="$emit('closeMap', true)"
        class="mb-3"
        color="white"
        outlined
      >
        Back
      </v-btn>
      <ServerSideDataTable
        :headers="headers"
        :items="regions"
        :sort-by="['city']"
        :loading="isLoading"
        :handle-page-change="handlePageChange"
        :handle-page-size-change="handlePageSizeChange"
        :current-page="page"
        hide-entries
        expand
        :page-size="size"
        :expanded-value="prefillValue"
        itemKey="countryId"
        @onExpanded="handleExpanded"
        :total-item-length="totalOrders"
      >
        <template v-slot:search-bar>
          <SearchBar
            label="Search"
            @input="handleOnSearch"
            class="justify-end"
            :filteredItems="filteredRegions"
            item-text="country"
            item-value="country"
            return-object
            with-dropdown
            @itemSelected="handleSelectedItem"
          >
            <div>
              <h1>Requested Services</h1>
              <p>List of all services ordered by customers</p>
            </div>
          </SearchBar>
        </template>

        <template v-slot:expanded-item="{item: subItem}">
          <td colspan="6" class="expanded-wrapper">
            <ServerSideDataTable
              class="expanded"
              :headers="headers"
              :items="subItem ? subItem.services : []"
              :sort-by="['city']"
              :loading="isLoading"
              :pageSize="1000"
              hide-entries
              hide-footer
            >
              <template v-slot:[`item.actions`]="{item, index}">
                <v-container>
                  <v-btn
                    v-if="item.status != 'Cancelled'"
                    class="btn-sending"
                    dark
                    small
                    @click="provideService(subItem, index)"
                  >
                    Provide service
                  </v-btn>
                </v-container>
              </template>

              <template v-slot:[`item.country`]="{item}">
                {{ item.city }}
              </template>

              <template v-slot:[`item.number_request`]="{item}">
                {{ item.number_request > 1000 ? "1000+" : item.number_request }}
              </template>

              <template v-slot:[`item.total_amount_dbio`]="{item}">
                {{ item.totalValue.dbio.toFixed(3) }}
              </template>

              <template v-slot:[`item.total_amount_usd`]="{item}">
                {{ item.totalValue.usd.toFixed(3) }}
              </template>
            </ServerSideDataTable>
          </td>
        </template>

        <template v-slot:[`item.country`]="{item}">
          <div
            :class="[
              'row-location d-flex align-center',
              {'row-location--active': item.isExpanded}
            ]"
          >
            <span>{{ item.country }}</span>
          </div>
        </template>

        <template v-slot:[`item.number_request`]="{item}">
          {{ item.number_request > 1000 ? "1000+" : item.number_request }}
        </template>

        <template v-slot:[`item.total_amount_dbio`]="{item}">
          {{ item.total_amount_dbio.toFixed(3) }}
        </template>

        <template v-slot:[`item.total_amount_usd`]="{item}">
          {{ item.total_amount_usd.toFixed(3) }}
        </template>

        <template v-slot:[`item.actions`]>-</template>
      </ServerSideDataTable>
    </v-col>
  </v-row>
</template>

<script>
import ServerSideDataTable from "@/components/DataTable/ServerSideDataTable"
import SearchBar from "../Mapping/SearchBar"
import localStorage from "@/lib/local-storage"

export default {
  name: "LabOrderHistory",
  props: {
    countryExpand: {type: String, default: ""},
    countries: {type: Array, default: () => []},
    size: {type: Number, default: 10},
    page: {type: Number, default: 1}
  },

  components: {
    ServerSideDataTable,
    SearchBar
  },

  data: () => ({
    headers: [
      {
        text: "Location",
        value: "country",
        sortable: false,
        width: "270px"
      },
      {
        text: "Number of requests",
        value: "totalRequests",
        sortable: false,
        align: "center",
        width: 160
      },
      {
        text: "Service",
        value: "category",
        sortable: false,
        width: "270px"
      },
      {
        text: "Total Amount (in DBIO)",
        value: "total_amount_dbio",
        sortable: false,
        align: "center",
        width: "200px"
      },
      {
        text: "Total Amount (in USD)",
        value: "total_amount_usd",
        sortable: false,
        align: "center",
        width: "200px"
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center"
      }
    ],
    regions: [],
    // page: 1,
    chevronIconChange: false,
    pageSize: 10,
    totalOrders: 0,
    address: "",
    onSelectedItem: false,
    password: "",
    searchQuery: "",
    isLoading: false
  }),

  created() {
    this.fetchRegions()
  },

  computed: {
    filteredRegions() {
      const filtered = this.regions.filter((region) =>
        this.searchQuery
          .toLowerCase()
          .split(" ")
          .every((v) => region.country.toLowerCase().includes(v))
      )

      return !this.onSelectedItem && !this.searchQuery ? this.regions : filtered
    },

    prefillValue() {
      return this.regions.filter(
        (region) =>
          region.country.toLowerCase() === this.countryExpand.toLowerCase()
      )
    }
  },

  methods: {
    handleOnSearch(val) {
      this.onSelectedItem = false
      this.searchQuery = val

      if (!this.onSelectedItem && !val) this.fetchRegions()
    },

    handleExpanded(expanded, id) {
      this.chevronIconChange = expanded
      this.regions.forEach((region) => {
        region.isExpanded = false

        if (region.countryId === id) region.isExpanded = expanded
      })
    },

    async fetchRegions() {
      const counter = (arrayCounters, key, childKey) => {
        return arrayCounters.reduce((accumulator, v) => {
          if (childKey) return accumulator + v[key][childKey]
          else return accumulator + v[key]
        }, 0)
      }

      this.totalOrders = this.countries.length
      this.regions = this.countries
        .map((region) => ({
          ...region,
          number_request: counter(region.services, "totalRequests"),
          total_amount_dbio: counter(region.services, "totalValue", "dbio"),
          total_amount_usd: counter(region.services, "totalValue", "usd"),
          isExpanded: false
        }))
        .sort((a, b) => {
          var nameA = a.country.toLowerCase()
          var nameB = b.country.toLowerCase()

          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }

          return 0
        })
    },

    provideService(item, idx) {
      const camelize = (str) => {
        return str
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase()
          })
          .replace(/\s+/g, "")
      }

      item.services = item.services.sort(function(a, b) {
        if (a.city < b.city) return -1
        if (b.city > a.city) return 1

        return 0
      })

      const keystore = localStorage.getAddress()
      const isLoggedIn = !!keystore
      const payload = {
        category: item.services[idx].category,
        country: {
          code: item.countryId,
          name: item.country
        },
        city: {
          code: item.services[idx].regionCode,
          name: item.services[idx].city
        },
        qc: {type: "DAI", value: 0},
        currency: {type: "DAI", value: 0},
        serviceFlow: "StakingRequestService"
      }

      const parameterQueries = Object.entries(payload).reduce(
        (filtered, [key, value]) => {
          if (typeof value === "object") {
            const nested = Object.entries(value).reduce(
              (nestedFiltered, [nestedKey, nestedValue]) => {
                nestedFiltered = {
                  ...nestedFiltered,
                  [`${camelize(`${key} ${nestedKey}`)}`]: nestedValue
                }
                return nestedFiltered
              },
              {}
            )

            filtered = {...filtered, ...nested}
          }

          filtered = {
            ...filtered,
            ...(typeof value === "object" ? {} : {[key]: value})
          }
          return filtered
        },
        {}
      )
      this.$store.dispatch("lab/setProvideService", {
        ...parameterQueries,
        serviceFlow: "StakingRequestService"
      })

      if (!isLoggedIn) {
        this.$router.push({
          name: "login",
          query: {redirect: "lab-dashboard-add-services"}
        })
        return
      }

      this.$router.push({name: "lab-dashboard-add-services"})
    },

    handleSelectedItem(item) {
      this.onSelectedItem = true
      this.regions = this.regions.filter(
        (region) => region.countryId === item.countryId
      )
    },

    async handlePageChange(value) {
      this.page = value
      await this.loadData()
    },

    async handlePageSizeChange(value) {
      // this.pageSize = value
      this.size = value
      this.page = 1 // If change page size restart from page 1
      await this.loadData()
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/variables.scss";

.btn-sending {
  background-color: $color-primary !important;
}

.v-data-table
  > .v-data-table__wrapper
  tbody
  tr.v-data-table__expanded__content {
  box-shadow: unset !important;
}

th:not(.expanded th):first-child {
  display: none;
}

td:not(.v-data-table__expanded__content td):first-child {
  display: none;
}

.degenics-data-table thead {
  background: #f5f7f9 !important;
}
.degenics-data-table thead th * {
  color: #363636 !important;
}

tr {
  cursor: pointer;
}

.expanded {
  padding: 0;

  .v-data-table__wrapper {
    margin-top: 30px;
  }

  tr {
    cursor: default;
  }

  td:first-child {
    padding-left: 50px !important;
  }

  .degenics-data-table {
    margin-top: -83px;
  }

  &-wrapper {
    padding: 0 !important;
  }

  .v-data-table-header {
    visibility: hidden;
  }

  .v-data-table__expanded__content {
    box-shadow: unset !important;
  }
}

.row-location {
  &::before {
    content: "\F0142";
    font: bold normal normal 18px/1 "Material Design Icons";
    color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 9px;
    border-radius: 50%;
    transition: 250ms all ease-in-out;
    background: #dadada;
  }

  &--active {
    &::before {
      transform: rotate(90deg);
    }
  }
}
</style>
