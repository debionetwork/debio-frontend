<template>
  <v-card width="100%" min-height="739" id="map-container">
    <h1 class="map-title">Requested Services</h1>

    <svg id="map"></svg>

    <div class="search-bar__wrapper">
      <SearchBar
        label="Search"
        @input="searchQuery = $event"
      ></SearchBar>
      <div class="search-bar__content rounded" v-if="!!filteredResults">
        <span class="search-bar__content-title">{{ filteredResults.name }}</span>
        <div class="search-bar__result-lists">
          <template v-if="filteredResults.services">
            <div class="search-bar__result-item rounded" v-for="(service, idx) in filteredResults.services" :key="idx">
              <div class="search-bar__result-title">{{ service.category }}</div>
              <div class="search-bar__result-content">
                <v-row>
                  <v-col>Total users</v-col>
                  <v-col>
                    <span>: {{ service.totalRequests }} Users</span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>Value staked (DBIO)</v-col>
                  <v-col>
                    <p class="mb-0">: {{ service.totalValue.dbio.toFixed(3) }} DBIO</p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>Value staked (USD)</v-col>
                  <v-col>
                    <p class="mb-0">: {{ service.totalValue.usd.toFixed(3) }} USD</p>
                  </v-col>
                </v-row>
                <v-btn
                  outlined
                  color="primary"
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

    <!-- <v-menu
      transition="slide-y-transition"
      max-height="397"
      :close-on-content-click="false"
      ref="selectContinent"
      bottom
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="filter-continent d-flex justify-space-between py-3 px-4"
          min-width="223"
          v-bind="attrs"
          v-on="on"
        >
          <span>{{ selectedContinent }}</span>
          <v-icon class="ml-4">mdi-chevron-up</v-icon>
        </v-btn>
      </template>
      <v-list>
        <template v-for="(continent, i) in continents">
          <v-list-item
            :key="i"
            v-if="!continent.subItems"
            link
            @click="onSelectContinent($event, continent)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ continent.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group
            v-else
            :key="i"
            expand
            no-action
          >
            <template v-slot:activator>
              <div class="d-flex flex-column">
                <v-divider class="mb-3"></v-divider>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">{{ continent.name }}</v-list-item-title>
                </v-list-item-content>
              </div>
            </template>
            <v-list-item
              v-for="(subItem, subIndex) in continent.subItems"
              :key="subIndex"
              link
              class="pl-8"
              @click="onSelectContinent($event, subItem)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ subItem.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-menu> -->

    <div class="controls">
      <!-- <v-btn class="controls-item" @click="getCurrentLocation()">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 7C12.0609 7 13.0783 7.42143 13.8284 8.17157C14.5786 8.92172 15 9.93913 15 11C15 12.0609 14.5786 13.0783 13.8284 13.8284C13.0783 14.5786 12.0609 15 11 15C9.93913 15 8.92172 14.5786 8.17157 13.8284C7.42143 13.0783 7 12.0609 7 11C7 9.93913 7.42143 8.92172 8.17157 8.17157C8.92172 7.42143 9.93913 7 11 7ZM2.05 12H0V10H2.05C2.5 5.83 5.83 2.5 10 2.05V0H12V2.05C16.17 2.5 19.5 5.83 19.95 10H22V12H19.95C19.5 16.17 16.17 19.5 12 19.95V22H10V19.95C5.83 19.5 2.5 16.17 2.05 12ZM11 4C9.14348 4 7.36301 4.7375 6.05025 6.05025C4.7375 7.36301 4 9.14348 4 11C4 12.8565 4.7375 14.637 6.05025 15.9497C7.36301 17.2625 9.14348 18 11 18C12.8565 18 14.637 17.2625 15.9497 15.9497C17.2625 14.637 18 12.8565 18 11C18 9.14348 17.2625 7.36301 15.9497 6.05025C14.637 4.7375 12.8565 4 11 4Z" fill="#FE008A"/>
        </svg>
      </v-btn> -->
      <v-btn class="controls-item" id="zoom_in">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M26.1667 18.8333H18.8333V26.1667H15.1667V18.8333H7.83333V15.1667H15.1667V7.83333H18.8333V15.1667H26.1667V18.8333ZM29.8333 0.5H4.16667C2.13167 0.5 0.5 2.13167 0.5 4.16667V29.8333C0.5 30.8058 0.886308 31.7384 1.57394 32.4261C2.26157 33.1137 3.19421 33.5 4.16667 33.5H29.8333C30.8058 33.5 31.7384 33.1137 32.4261 32.4261C33.1137 31.7384 33.5 30.8058 33.5 29.8333V4.16667C33.5 2.13167 31.85 0.5 29.8333 0.5Z" fill="#FE008A"/>
        </svg>
      </v-btn>
      <v-btn class="controls-item" id="zoom_out">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M26.1667 18.8333H7.83333V15.1667H26.1667V18.8333ZM29.8333 0.5H4.16667C2.13167 0.5 0.5 2.13167 0.5 4.16667V29.8333C0.5 30.8058 0.886308 31.7384 1.57394 32.4261C2.26157 33.1137 3.19421 33.5 4.16667 33.5H29.8333C30.8058 33.5 31.7384 33.1137 32.4261 32.4261C33.1137 31.7384 33.5 30.8058 33.5 29.8333V4.16667C33.5 2.13167 31.85 0.5 29.8333 0.5Z" fill="#FE008A"/>
        </svg>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import * as d3 from "d3"
import SearchBar from "./SearchBar"
import { convertSLug } from "@/utils/convertSlug"

export default {
  name: "MapCountry",
  components: { SearchBar },
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
    continents: [
      { name: 'World' },
      { name: 'Africa'  },
      { name: 'America' },
      { name: 'Asia'  },
      { name: 'Europe'  },
      { name: 'Oceania' },
      {
        name: 'American Sub-continent',
        subItems: [
          { name: "Northern America" },
          { name: "Southern America" },
          { name: "Southern America Latin America" }
        ],
        active: true
      },
      {
        name: 'Asian Sub-continent',
        subItems: [
          { name: "Indonesia" },
          { name: "Singapore" }
        ],
        active: false
      },
    ],
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
      const projection = d3.geoMercator()
        .scale(150)
        .center([0, 40])
        .translate([svgWidth / 2, svgHeight / 2])
      const path = d3
        .geoPath()
        .projection(projection)
      var zoom = d3.zoom()
        .scaleExtent([1/2, 4])
        .on("zoom", zoomed);

      if (!val?.name) {
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
        .style("stroke", "transparent")
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
      function boxZoom(box, centroid, paddingPerc) {
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

        svg
          .transition()
          .duration(500)
          .call(
            zoom.transform,
            d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
          );
      }

      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
      d3.select(`#${convertSLug(val.name)}`)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")
        const country = d3.select(`#${convertSLug(val.name)}`)?._groups[0][0]?.__data__
        if (!country) return
        boxZoom(path.bounds(country), path.centroid(country), 70)
    }
  },

  mounted() {
    this.renderD3()
  },

  methods: {
    onSelectContinent(e, { name }) {
      this.selectedContinent = name
    },

    selectProvince(province) {
      this.province = province
    },

    openInfo(province) {
      this.currentProvince = province
    },

    closeInfo() {
      this.currentProvince = undefined
    },

    zoomInMap(zoom, svg, zoomLevel) {
      return svg.transition()
        .delay(100)
        .duration(700)
        .call(zoom.scaleBy, zoomLevel)
    },

    zoomOutMap(zoom, svg, zoomLevel) {
      return svg.transition()
        .delay(100)
        .duration(700)
        .call(zoom.scaleBy, zoomLevel)
    },

    getCurrentLocation() {
      const showPosition = (position) => {
        console.log("showPosition ==> ", position)
      }

      if (navigator.geolocation) navigator.geolocation.watchPosition(showPosition)
      else console.log("Geolocation is not supported by this browser.")

    },

    handleSeeDetails(country) {
      this.$emit("openList", false, country)
    },

    createTooltip({country = '', totalRequests = '', totalValue = { dbio: 0, usd: 0 }}) {
      return `
          <div class="header">
            <h3>${country}</h3>
          </div>
          <div class="content">
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <p>Categories Requested</p>
              <p>${totalRequests} users</p>
            </div>
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <div>Value staked (DBIO)</div>
              <b>${totalValue.dbio.toFixed(3) || 0}</b>
            </div>
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <div>Value staked (USD)</div>
              <b>${totalValue.usd.toFixed(3) || 0}</b>
            </div>
          </div>
        `
    },

    renderD3() {
      const self = this;
      const serviceRequestByCountry = {...this.serviceRequestByCountry}
      const svg = d3.select("svg")
      svg.attr("width", Math.round(document.querySelector(".v-card").getBoundingClientRect().width))
      svg.attr("height", Math.round(document.querySelector(".v-card").getBoundingClientRect().height))
      const svgWidth = +svg.attr("width")
      const svgHeight = +svg.attr("height")
      const data = new Map()
      const projection = d3.geoMercator()
        .scale(150)
        .center([0, 40])
        .translate([svgWidth / 2, svgHeight / 2])

      const path = d3
        .geoPath()
        .projection(projection)

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

      function boxZoom(box, centroid, paddingPerc) {
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

        svg
          .transition()
          .duration(500)
          .call(
            zoom.transform,
            d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
          );
      }

      d3.selectAll('button').on('click', function() {
        if (this.id === 'zoom_in') {
          transition(2)
        }
        if (this.id === 'zoom_out') {
          transition(-2)
        }
      })

      var tooltip2 = d3.select("#map-container")
        .append("div")
          .attr("class", "debio-map-tooltip")
          .style("position", "absolute")
          .style("visibility", "hidden")
          .style("background-color", "white")
          .style("min-width", "250px")
          .html(self.createTooltip({}))
      

      Promise.all([
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
        d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) {
          data.set(d.code, +d.pop)
        })]).then(function(loadData){
          let topo = loadData[0].features.filter(map => map.properties.name !== "Antarctica")
          self.countries = topo.map(map => {
            const country = { name: map.properties.name }
            const service = serviceRequestByCountry[map.properties.name]

            if (service !== undefined) country.services = service.services

            return country
          })

          svg.append("g")
            .selectAll("path")
            .data(topo)
            .enter()
            .append("path")
              .attr("id", (d) => convertSLug(d.properties.name))
              .attr("d", d3.geoPath()
                .projection(projection)
              )
              .attr("fill", function (d) {
                const country = d.properties.name
                let colorIndex = 0
                const colors = ["#E8E8E8", "#ACDFE3", "#5DC9CC", "#079DAB", "#FDD07D", "#F7C192", "#D9442C"]

                if (serviceRequestByCountry[country] === undefined) colors[colorIndex]

                const request = serviceRequestByCountry[country]?.totalRequests

                if (request <= 5) colorIndex = 1
                if (request > 5) colorIndex = 2
                if (request > 10) colorIndex = 3
                if (request > 20) colorIndex = 4
                if (request > 25) colorIndex = 5
                if (request > 30) colorIndex = 6

                return colors[colorIndex];
              })
              .style("stroke", "transparent")
              .attr("class", function(){ return "Country" } )
              .style("opacity", .8)
              .on("click", function(d){
                d3.selectAll(".Country")
                  .transition()
                  .duration(200)
                  .style("opacity", .5)
                d3.select(this)
                  .transition()
                  .duration(200)
                  .style("opacity", 1)
                  .style("stroke", "black")
                const country = d.target.__data__
                self.searchQuery = country.properties.name
                boxZoom(path.bounds(country), path.centroid(country), 70)
              })
              .on("mouseenter", function(d){
                d3.selectAll(".Country")
                  .transition()
                  .duration(200)
                  .style("opacity", .5)
                  .style("stroke", "transparent")
                d3.select(this)
                  .transition()
                  .duration(200)
                  .style("opacity", 1)
                  .style("stroke", "black")
                const country = d.target.__data__.properties.name
                if (serviceRequestByCountry[country] != undefined) {
                  const { totalRequests, totalValue } = serviceRequestByCountry[country]
                  return tooltip2
                    .html(self.createTooltip({ country, totalRequests, totalValue }))
                    .style("visibility", "visible");
                }
              })
              .on("mousemove", function(event){
                return tooltip2
                  .style("top", (event.pageY-110)+"px")
                  .style("left",(event.pageX-360)+"px")
              })
              .on("mouseout", function(){
                return tooltip2.style("visibility", "hidden");
              });
      })
    }
  }
}
</script>

<style lang="scss">
  .search-bar {
    &__wrapper {
      position: absolute;
      top: 150px;
      left: 52px;
    }

    &__content {
      width: 100%;
      min-height: 100px;
      border: 2px solid #F5F5F5;
      padding: 13px 14px;
      margin-top: 11px;
      background: #FFFFFF;

      &-title {
        font-size: 25px;
        margin-left: 12px;
        font-weight: bold;
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
      width: 100%;
      padding: 21px 16px;
      border: 2px solid #F5F5F5;
    }

    &__result-content {
      p, span {
        font-size: 15px;
        font-weight: 400;
        line-height: 23px;
      }
    }

    &__result-title {
      font-size: 18px;
      font-weight: 600;
      line-height: 27px;
      margin-bottom: 14px;
    }

    &__result-action {
      margin-top: 18px;
    }
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 22px;
    position: absolute;
    bottom: 36px;
    right: 36px;

    &-item {
      background: unset !important;
      box-shadow: unset;

      &:focus {
        background: unset !important;
        box-shadow: unset;
      }
    }
  }

  .filter-continent {
    height: 47px !important;
    position: absolute;
    top: 150px;
    right: 52px;
    border: 1px solid #7D4180;
    border-radius: 4px;
    background: #FFF !important;
    padding: 0 !important;

    &:focus {
      background: #FFF !important;
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

  .debio-map-tooltip {
    border-radius: 4px;
    font-family: "Roboto", sans-serif !important;
    border: 1px solid #edf0ee;
    padding: 14px;
    z-index: 99;

    .header {
      padding-bottom: 5px;
    }
    .content {
      font-size: 14px;
      div {
        margin-top: 2px;
      }
    }
  }

  .map-title {
    position: absolute;
    top: 70px;
    left: 52px;
  }
</style>