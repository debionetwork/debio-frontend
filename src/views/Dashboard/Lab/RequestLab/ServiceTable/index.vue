<template>
	<v-row>
		<v-col>
      <v-btn @click="$emit('closeMap', true)" class="mb-3" color="white" outlined>
        Back
      </v-btn>
			<ServerSideDataTable
				:headers="headers"
				:items="regions"
				:sort-by="['created_at']"
				:sort-desc="[true]"
				:loading="isLoading"
				:handle-page-change="handlePageChange"
				:handle-page-size-change="handlePageSizeChange"
				:current-page="page"
				hide-footer
				hide-entries
				expand
				:page-size="pageSize"
				additional-class="laporan-table"
        :expanded-value="prefillValue"
				@onExpanded="handleExpanded"
			>
				<template v-slot:search-bar>
					<SearchBar
						label="Search"
						@input="handleOnSearch"
						class="justify-end"
            :filteredItems="filteredRegions"
            item-text="location"
            item-value="location"
            return-object
            with-dropdown
            @itemSelected="handleSelectedItem"
					>
            <h1>Requested Services</h1>
					</SearchBar>
				</template>

				<template v-slot:expanded-item="{ item }">
					<td colspan="6" class="expanded-wrapper">
						<ServerSideDataTable
							class="expanded"
							:headers="headers"
							:items="item ? item.sub_locations : []"
							:sort-by="['created_at']"
							:sort-desc="[true]"
							:loading="isLoading"
							hide-entries
							hide-footer
						>
							<template v-slot:[`item.actions`]="{ item }">

								<v-container>
									<v-btn
										v-if="item.status != 'Cancelled'"
										class="btn-sending"
										dark
										small
										width="200"
										@click="provideService(item)"
									>
										Provide this service
									</v-btn>
								</v-container>

							</template>

              <template v-slot:[`item.number_request`]="{ item }">
                {{ item.number_request > 1000 ? "1000+" : item.number_request }}
              </template>

              <template v-slot:[`item.total_amount_dai`]="{ item }">
                {{ item.total_amount_dai }} DAI
              </template>

              <template v-slot:[`item.total_amount_usd`]="{ item }">
                {{ item.total_amount_usd }} USD
              </template>

						</ServerSideDataTable>
					</td>
				</template>

				<template v-slot:[`item.location`]="{ item }">
					<div :class="['row-location d-flex align-center', { 'row-location--active': item.isExpanded }]">
						<span>{{ item.location }}</span>
					</div>
				</template>

				<template v-slot:[`item.number_request`]="{ item }">
					{{ item.number_request > 1000 ? "1000+" : item.number_request }}
				</template>

				<template v-slot:[`item.total_amount_dai`]="{ item }">
					{{ item.total_amount_dai }} DAI
				</template>

				<template v-slot:[`item.total_amount_usd`]="{ item }">
					{{ item.total_amount_usd }} USD
				</template>

				<template v-slot:[`item.actions`]>-</template>
			</ServerSideDataTable>
		</v-col>
	</v-row>
</template>

<script>
import ServerSideDataTable from '@/components/DataTable/ServerSideDataTable'
import SearchBar from "../Mapping/SearchBar"
import Regions from "./regions.json"
import localStorage from '@/lib/local-storage'

export default {
  name: 'LabOrderHistory',
  props: {
    countryExpand: { type: String, default: "" }
  },
	
  components: {
    ServerSideDataTable,
    SearchBar,
  },

  data: () => ({
    headers: [
      {
				text: 'Location',
				value: 'location',
				sortable: false,
				width: '270px'
			},
      {
				text: 'Number of requests',
				value: 'number_request',
				sortable: false,
				align: 'center',
				width: '100px'
			},
      {
				text: 'Service',
				value: 'service',
				sortable: false,
				width: '270px'
			},
      {
				text: 'Total Amount (in DAI)',
				value: 'total_amount_dai',
				sortable: false,
				align: 'center',
				width: '200px'
			},
      {
				text: 'Total Amount (in USD)',
				value: 'total_amount_usd',
				sortable: false,
				align: 'center',
				width: '200px'
			},
      {
				text: 'Actions',
				value: 'actions',
				sortable: false,
				align: 'center',
				width: '270px'
			}
    ],
    regions: [],
    page: 1,
		chevronIconChange: false,
    pageSize: 10,
    totalOrders: 0,
    address: '',
    onSelectedItem: false,
    password: '',
    searchQuery: '',
		isLoading: false
  }),

  created() {
    this.fetchRegions()
  },

  computed: {
    filteredRegions() {
      const filtered = this.regions.filter(region =>
        this.searchQuery.toLowerCase().split(' ').every(v => region.location.toLowerCase().includes(v))
      )

      return !this.onSelectedItem && !this.searchQuery ? this.fetchRegions() : filtered
    },

    prefillValue() {
      return this.regions.filter(region => region.location.toLowerCase() === this.countryExpand.toLowerCase())
    }
  },

  methods: {
    handleOnSearch(val) {
      this.onSelectedItem = false
      this.searchQuery = val
    },

		handleExpanded(expanded, id) {
			this.chevronIconChange = expanded
			this.regions.forEach(region => {
				region.isExpanded = false

				if (region.id === id) region.isExpanded = expanded
			})
		},

		fetchRegions() {
      const counter = (arrayCounters, key) => {
        return arrayCounters.reduce((accumulator, v) => {
          return accumulator + v[key]
        }, 0)
      }

			this.regions = Regions.map(region => ({
        ...region,
        number_request: counter(region.sub_locations, "number_request"),
        total_amount_dai: counter(region.sub_locations, "total_amount_dai"),
        total_amount_usd: counter(region.sub_locations, "total_amount_usd"),
        isExpanded: false
      })).sort((a, b) => {
        var nameA = a.location.toLowerCase()
        var nameB = b.location.toLowerCase()

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        return 0;
      })
		},

    provideService(item){
      const camelize = (str) => {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase()
        }).replace(/\s+/g, '')
      }

      const keystore = localStorage.getAddress()
      const isLoggedIn = !!keystore
      const payload = {
        name: item.service,
        category: "Single Nucleotide Polymorphism (SNP) Microarray",
        location: item.location,
        qc: { type: "DAI", value: 56 },
        currency: { type: "Ethereum", value: 89 },
        description: {
          short: "It is a paradisematic country",
          long: "Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar."
        },
        duration: { type: "Hours", value: 9 },
      }

      const parameterQueries = Object.entries(payload).reduce((filtered, [key, value]) => {
        if (typeof value === "object") {
          const nested = Object.entries(value).reduce((nestedFiltered, [nestedKey, nestedValue]) => {
            nestedFiltered = { ...nestedFiltered, [`${camelize(`${key} ${nestedKey}`)}`]: nestedValue }
            return nestedFiltered
          }, {})

          filtered = { ...filtered, ...nested }
        }

        filtered = {
          ...filtered,
          ...typeof value === "object"
            ? {}
            : { [key]: value } }

        return filtered
      }, {})

      this.$store.dispatch("lab/setProvideService", { ...parameterQueries, service_flow: "stakingRequestService" })

      if (!isLoggedIn) {
        this.$router.push({ name: "login", query: { redirect: "lab-dashboard-add-services" } })
        return
      }

      this.$router.push({ name: "lab-dashboard-add-services" })
    },

    handleSelectedItem(item) {
      this.onSelectedItem = true
      this.regions = this.regions.filter(region => region.id === item.id)
    },

    async handlePageChange(value){
      this.page = value
      await this.loadData()

    },

    async handlePageSizeChange(value){
      this.pageSize = value
      this.page = 1 // If change page size restart from page 1
      await this.loadData()
    }
  },
}


</script>

<style lang="scss">
@import "@/styles/variables.scss";

.btn-sending {
   background-color: $color-primary !important;
}

.v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
	box-shadow: unset !important;
}

th:not(.expanded th):first-child {
	display: none;
}

td:not(.v-data-table__expanded__content td):first-child {
	display: none;
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
    content: '\F0142';
    font: bold normal normal 18px/1 "Material Design Icons";
    color: rgba(0, 0, 0, .4);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 9px;
    border-radius: 50%;
    transition: 250ms all ease-in-out;
    background: #DADADA;
  }

  &--active {
    &::before {
      transform: rotate(90deg);
    }
  }
}
</style>
