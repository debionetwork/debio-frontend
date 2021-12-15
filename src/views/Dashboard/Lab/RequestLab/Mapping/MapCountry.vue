<template>
  <v-card width="100%" min-height="739" id="map-container">
    <svg id="map"></svg>

    <div class="search-bar__wrapper">
      <div class="search-bar__box">
        <h4 class="mb-5">Requested Services</h4>
        <v-text-field
          class="search-bar__input"
          v-model="searchQuery"
          prepend-icon="mdi-magnify"
          append-icon="mdi-close-circle-outline"
          @click:append="searchQuery = ''"
        ></v-text-field>
      </div>
      <div class="search-bar__content rounded" v-if="!!filteredResults">
        <span class="search-bar__content-title">
          <b>{{ filteredResults.services ? filteredResults.services.length : 0 }} Results</b>
          on {{ filteredResults.name }}
        </span>
        <div class="search-bar__result-lists">
          <template v-if="filteredResults.services">
            <div class="search-bar__result-item rounded" v-for="(service, idx) in filteredResults.services" :key="idx">
              <div class="search-bar__result-title">{{ service.category }}</div>
              <div class="search-bar__result-content">
                <v-row>
                  <v-col>
                    <v-row>
                      <v-col class="text-caption text-center pre-white-space">Total users</v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-center font-weight-bold pre-white-space">{{ service.totalRequests }} Users</v-col>
                    </v-row>
                  </v-col>
                  <v-col>
                    <v-row>
                      <v-col class="text-caption text-center pre-white-space">Value(DBIO)</v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-center font-weight-bold pre-white-space">{{ service.totalValue.dbio.toFixed(3) }} DBIO</v-col>
                    </v-row>
                  </v-col>
                  <v-col>
                    <v-row>
                      <v-col class="text-caption text-center pre-white-space">Value(USD)</v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-center font-weight-bold pre-white-space">{{ service.totalValue.usd.toFixed(3) }} USD</v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-btn
                  outlined
                  color="new_blue"
                  width="100%"
                  class="search-bar__result-action"
                  @click="handleSeeDetails(filteredResults.name)"
                >
                  See details
                </v-btn>
              </div>
            </div>
          </template>
          <div v-else class="search-bar__result">No services yet</div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import * as d3 from "d3"
import * as topojson from "topojson"
import { convertSLug } from "@/utils/convertSlug"

export default {
  name: "MapCountry",
  props: {
    serviceRequestByCountry: Object,
  },

  data: () => ({
    selectedContinent: "World",
    width: null,
    height: null,
    data: new Map(),
    searchQuery: "",
    province: null,
    currentProvince: null,
    tooltipTotalRequest: 0,
    tooltipTotalValue: 0,
    tooltipCountry: '',
    active: false,
    countries: [],
  }),

  computed: {
    filteredResults() {
      return this.searchQuery
        ? this.countries.find(country => (
          this.searchQuery.toLowerCase().split(' ').every(v =>
            country.name.toLowerCase().includes(v)
          )
        ))
        : null
    }
  },

  watch: {
    filteredResults(val) {
      const svg = d3.select("svg")
      svg.attr("width", Math.round(document.querySelector(".v-card").getBoundingClientRect().width))
      svg.attr("height", 739)
      const svgWidth = +svg.attr("width")
      const svgHeight = +svg.attr("height")
      const projection = d3.geoNaturalEarth1()
        .scale(300)
        .center([0, 10])
        .translate([svgWidth / 2, svgHeight / 2])
      const path = d3
        .geoPath()
        .projection(projection)
      var zoom = d3.zoom()
        .scaleExtent([1/2, 4])
        .on("zoom", zoomed);

      if (!val?.name) {
        d3.selectAll(".country")
        .transition()
        .duration(200)
        .style("opacity", .5)
        svg
          .transition()
          .duration(500)
          .call(
            zoom.transform,
            d3.zoomIdentity.translate(0, 0).scale(1)
          );
        return
      }

      function zoomed(event) {
        const g = d3.select("g")
        g.attr('transform', `translate(${event.transform.x}, ${event.transform.y}) scale(${event.transform.k})`)
      }

      function boxZoom(box, centroid, paddingPerc, name) {
        let minXY = box[0];
        let maxXY = box[1];

        let zoomWidth = Math.abs(minXY[0] - maxXY[0]);
        let zoomHeight = Math.abs(minXY[1] - maxXY[1]);

        let zoomMidX = centroid[0];
        let zoomMidY = centroid[1];

        zoomWidth = zoomWidth * (1 + paddingPerc / 100);
        zoomHeight = zoomHeight * (1 + paddingPerc / 100);

        let maxXscale = document.querySelector("svg").getBoundingClientRect().width / zoomWidth;
        let maxYscale = document.querySelector("svg").getBoundingClientRect().height / zoomHeight;
        let zoomScale = Math.min(maxXscale, maxYscale);

        let offsetX = zoomScale * zoomMidX;
        let offsetY = zoomScale * zoomMidY;

        let dleft = Math.min(0, document.querySelector("svg").getBoundingClientRect().width / 2 - offsetX);
        let dtop = Math.min(0, document.querySelector("svg").getBoundingClientRect().height / 2 - offsetY);

        dleft = Math.max(document.querySelector("svg").getBoundingClientRect().width - svgWidth * zoomScale, dleft) + 220;
        dtop = Math.max(document.querySelector("svg").getBoundingClientRect().height - svgHeight * zoomScale, dtop);

        // Custom coordinate translate for Australia
        zoomScale = name ? 4 : zoomScale
        dleft = name ? -4348 : dleft
        dtop = name ? -1884 : dtop

        svg
          .transition()
          .duration(500)
          .call(
            zoom.transform,
            d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
          );
      }

      d3.selectAll(".country")
        .transition()
        .duration(200)
        .style("opacity", .5)
      d3.select(`#${convertSLug(val.name)}`)
        .transition()
        .duration(200)
        .style("opacity", 1)

      const country = d3.select(`#${convertSLug(val.name)}`)?._groups[0][0]?.__data__
      const isAustralia = country.properties.name === "Australia"
      if (!country) return
      boxZoom(path.bounds(country), path.centroid(country), 70, isAustralia)
    }
  },

  mounted() {
    this.renderD3()
  },

  methods: {
    handleSeeDetails(country) {
      this.$emit("openList", false, country)
    },

    createTooltip({ country, totalValue = { dbio: 0 }, totalRequests }) {
      return `
        <h3 class="tooltip__header">${country}</h3>
        <div class="tooltip__content">
          <div class="tooltip__field d-flex justify-between">
            <p class="tooltip__field-title mb-0 mr-8">Categories Requested</p>
            <b class="tooltip__field-desc mb-0">${totalRequests}</b>
          </div>
          <div class="tooltip__field d-flex justify-between">
            <p class="tooltip__field-title mb-0 mr-8">Value staked</p>
            <b class="tooltip__field-desc mb-0">${totalValue.dbio.toFixed(3)}</b>
          </div>
        </div>
      `
    },

    renderD3() {
      const context = this
      const serviceRequestByCountry = {...this.serviceRequestByCountry}

      const svg = d3.select('svg');

      svg.attr("width", Math.round(document.querySelector(".v-card").getBoundingClientRect().width))
      svg.attr("height", Math.round(document.querySelector(".v-card").getBoundingClientRect().height))

      const svgWidth = +svg.attr("width")
      const svgHeight = +svg.attr("height")

      const projection = d3.geoNaturalEarth1()
        .scale(300)
        .center([0, 10])
        .translate([svgWidth / 2, svgHeight / 2])
      const pathGenerator = d3.geoPath().projection(projection);

      const g = svg.append('g');

      var zoom = d3.zoom()
        .scaleExtent([1/2, 4])
        .on("zoom", zoomed);

      svg.call(zoom);

      function zoomed(event) {
        const g = d3.select("g")
        g.attr('transform', `translate(${event.transform.x}, ${event.transform.y}) scale(${event.transform.k})`)
      }

      function transition(zoomLevel) {
        svg.transition()
          .delay(100)
          .duration(700)
          .call(zoom.scaleBy, zoomLevel);
      }

      d3.selectAll('button').on('click', function() {
        if (this.id === 'zoom_in') {
          transition(2)
        }
        if (this.id === 'zoom_out') {
          transition(-2)
        }
      })

      function boxZoom(box, centroid, paddingPerc, name) {
        let minXY = box[0];
        let maxXY = box[1];

        let zoomWidth = Math.abs(minXY[0] - maxXY[0]);
        let zoomHeight = Math.abs(minXY[1] - maxXY[1]);

        let zoomMidX = centroid[0];
        let zoomMidY = centroid[1];

        zoomWidth = zoomWidth * (1 + paddingPerc / 100);
        zoomHeight = zoomHeight * (1 + paddingPerc / 100);

        let maxXscale = document.querySelector("svg").getBoundingClientRect().width / zoomWidth;
        let maxYscale = document.querySelector("svg").getBoundingClientRect().height / zoomHeight;
        let zoomScale = Math.min(maxXscale, maxYscale);

        let offsetX = zoomScale * zoomMidX;
        let offsetY = zoomScale * zoomMidY;

        let dleft = Math.min(0, document.querySelector("svg").getBoundingClientRect().width / 2 - offsetX);
        let dtop = Math.min(0, document.querySelector("svg").getBoundingClientRect().height / 2 - offsetY);

        dleft = Math.max(document.querySelector("svg").getBoundingClientRect().width - svgWidth * zoomScale, dleft) + 220;
        dtop = Math.max(document.querySelector("svg").getBoundingClientRect().height - svgHeight * zoomScale, dtop)

        // Custom coordinate translate for Australia
        zoomScale = name ? 4 : zoomScale
        dleft = name ? -4348 : dleft
        dtop = name ? -1884 : dtop

        svg
          .transition()
          .duration(500)
          .call(
            zoom.transform,
            d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
          );
      }

      const countryColorScale = val => {
        const country = val.properties.name
        let colorIndex = 0
        const colors = ["#FFFFFF", "#ACDFE3", "#5DC9CC", "#079DAB", "#FDD07D", "#F7C192", "#D9442C"]

        if (serviceRequestByCountry[country] === undefined) colors[colorIndex]

        const request = serviceRequestByCountry[country]?.totalRequests

        if (request <= 5) colorIndex = 1
        if (request > 5) colorIndex = 2
        if (request > 10) colorIndex = 3
        if (request > 20) colorIndex = 4
        if (request > 25) colorIndex = 5
        if (request > 30) colorIndex = 6

        return colors[colorIndex];
      }

      const loadAndProcessData = () =>

        Promise.all([
          d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
          d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
        ])

        .then(([tsvData, topoJSONdata]) => {
          const rowById = tsvData.reduce((accumulator, d) => {
            accumulator[d.iso_n3] = d;
            return accumulator;
          }, {});

          const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);

          countries.features.forEach(d =>{
            Object.assign(d.properties, rowById[d.id])
          });

          context.countries = countries.features.map(map => {
            const country = { name: map.properties.name }
            const service = serviceRequestByCountry[map.properties.name]

            if (service !== undefined) country.services = service.services

            return country
          })

          return countries;
        });

      loadAndProcessData().then(countries => {
        var tooltip = d3.select("#map-container")
          .append("div")
            .attr("class", "tooltip")
            .style("visibility", "hidden")
            .style("min-width", "250px")
            .html(context.createTooltip({}))

        g.selectAll('path').data(countries.features)
          .enter().append('path')
            .attr('class', 'country')
            .attr('d', pathGenerator)
            .attr('fill', d => countryColorScale(d))
            .attr("id", (d) => convertSLug(d.properties.name))
            .on('mouseenter', function(e) {
              d3.selectAll(".country")
                .transition()
                .duration(200)
                .style("opacity", .5)
              d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)

              const country = e.target.__data__.properties.name
              if (serviceRequestByCountry[country] != undefined) {
                const { totalRequests, totalValue } = serviceRequestByCountry[country]
                return tooltip
                  .html(context.createTooltip({ country, totalValue, totalRequests }))
                  .style("opacity", "1")
                  .style("visibility", "visible");
              }
            })
            .on('mousemove', function(e) {
              return tooltip
                .style("top", (e.pageY-70)+"px")
                .style("left",(e.pageX-330)+"px")
            })
            .on('mouseout', function() {
              d3.selectAll(".country")
                .transition()
                .duration(200)
                .style("opacity", 1)
              d3.select(this)
                .transition()
                .duration(200)
              return tooltip
                .style("visibility", "hidden")
                .style("opacity", "0")
            })
            .on('click', function(e) {
              const country = e.target.__data__
              const isAustralia = country.properties.name === "Australia"
                ? country.properties.name
                : null

              context.searchQuery = country.properties.name
              boxZoom(
                pathGenerator.bounds(country),
                pathGenerator.centroid(country),
                70,
                isAustralia
              )
            })
      });
    }
  }
}
</script>

<style lang="scss">
  .search-bar {
    &__wrapper {
      position: absolute;
      top: 45px;
      left: 35px;
    }

    &__box {
      background: #FFFFFF;
      padding: 1rem;
      border-radius: 8px;
    }

    &__input {
      border: 1px solid #6F4CEC;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      padding: 8px 12px;

      .v-text-field__details {
        display: none;
      }

      .v-input__slot {
        margin: 0;

        &::before, &::after {
          display: none;
        }
      }

      .v-input__icon .v-input__icon--prepend .v-icon {
        color: red !important;
      }
    }

    &__content {
      width: 100%;
      min-height: 100px;
      border: 2px solid #F5F5F5;
      padding: 25px 20px;
      display: flex;
      flex-direction: column;
      margin-top: 1rem;
      background: #FFFFFF;

      &-title {
        font-size: 14px;
        padding-bottom: 25px;
        margin-bottom: 20px;
        border-bottom: 2px solid #E7EEF4;
      }
    }
    &__result-lists {
      margin-top: 13px;
      position: relative;
      width: 100%;
      max-height: 420px;
      display: flex;
      flex-direction: column;
      gap: 14px 0;
      overflow-y: scroll;
      padding-right: 1rem;

      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
        background-color: #F5F5F5;
      }

      &::-webkit-scrollbar {
        width: 5px;
        background-color: #F5F5F5;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background: #D3C9D1;
      }
    }

    &__result-item {
      padding: 21px 16px;
      border: 2px solid #F5F5F5;
      box-shadow: 5px 10px 20px rgba(0, 133, 255, 0.1);
    }

    &__result-content {
      p, span {
        font-size: 15px;
        font-weight: 400;
        line-height: 23px;
      }
    }

    &__result-title {
      font-size: 1rem;
      font-weight: 600;
      line-height: 27px;
      margin-bottom: 14px;
    }

    &__result-action {
      margin-top: 18px;
    }
  }

  .v-menu__content {
    top: 239px !important;
    border: 1px solid #7D4180;
    border-radius: 4px;

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 10px;
      background-color: #D3C9D1;
    }

    &::-webkit-scrollbar {
      width: 5px;
      background-color: #D3C9D1;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      background: #7D4180;
    }
  }

  .v-list-group__header__append-icon {
    display: none;
  }

  .v-ripple__container {
    display: none !important;
  }

  #map-container {
    background: rgb(208,228,255);
    background: linear-gradient(180deg, rgba(208,228,255,1) 0%, rgba(224,232,244,1) 70%, rgba(231,236,243,1) 100%);
  }

  svg {
    position: relative
  }

  .tooltip {
    padding: 1rem;
    position: absolute;
    background: #FFFFFF;
    border-radius: 8px;
    z-index: 100;
    transition: opacity .3s ease-in-out;
    opacity: 0;
    box-shadow:
      0.2px 2.3px 3.6px rgba(0, 0, 0, 0.03),
      0.6px 6.4px 10px rgba(0, 0, 0, 0.03),
      1.5px 15.4px 24.1px rgba(0, 0, 0, 0.035),
      5px 51px 80px rgba(0, 0, 0, 0.13)
    ;

    &__header {
      margin-bottom: 1rem;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__field {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .pre-white-space {
    white-space: pre;
  }

  .country {
    transition: all .5s ease-in-out;
  }

</style>
