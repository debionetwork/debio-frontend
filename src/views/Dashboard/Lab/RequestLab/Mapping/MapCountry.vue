/* eslint-disable no-unused-vars */
<template>
  <v-card width="100%">
    <svg id="map" width="1000" height="600"></svg>
  </v-card>
</template>

<script>
import * as d3 from "d3"

export default {
  name: "MapCountry",

  data() {
    return {
      width: null,
      height: null,
      data: new Map(),
      province: null,
      currentProvince: null,
      tooltipTotalRequest: 0,
      tooltipTotalValue: 0,
      tooltipCountry: '',
    }
  },

  props: {
    serviceRequestByCountry: Object,
  },

  computed: {
    // projection() {
    //   return 
    // },

    path() {
      return d3.geoPath()
    }
  },

  mounted() {
    this.renderD3()
  },

  methods: {
    fetchData() {

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

    createTooltip({country = '', totalRequests = '', totalValue = ''}) {
      return `
          <div class="header">
            <h3>${country}</h3>
          </div>
          <div class="content">
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <p>Total requests</p>
              <p>${totalRequests} users</p>
            </div>
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <div>Total value staked</div>
              <div>${totalValue.toLocaleString()} <b>DAI</b></div>
            </div>
          </div>
        `
    },

    renderD3() {
      const self = this;
      const serviceRequestByCountry = {...this.serviceRequestByCountry}
      const svg = d3.select("svg")
      const svgWidth = +svg.attr("width")
      const svgHeight = +svg.attr("height")
      const data = new Map()
      const projection = d3.geoMercator()
        .scale(150)
        .center([0, 50])
        .translate([svgWidth / 2, svgHeight / 2])

      var tooltip2 = d3.select("body")
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
          let topo = loadData[0]

          // eslint-disable-next-line no-unused-vars
          let onClickedArea = function() {
            d3.selectAll(".Country")
              .transition()
              .duration(200)
              .style("opacity", .5)
            d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", 1)
              .style("stroke", "black")
          }


          // Draw the map
          svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
              // draw each country
              .attr("d", d3.geoPath()
                .projection(projection)
              )
              // set the color of each country
              .attr("fill", function (d) {
                let color = '#'+Math.floor(Math.random() * Math.pow(2,32) ^ 0xffffff).toString(16).substr(-6);
                if (d.properties.name === "Antarctica") color = "#cccccc"
                return color;
              })
              .style("stroke", "transparent")
              // eslint-disable-next-line no-unused-vars
              .attr("class", function(d){ return "Country" } )
              .style("opacity", .8)
              .on("click", onClickedArea)
              .on("mouseover", function(d){
                // console.log(d.target.__data__.properties.name)
                const country = d.target.__data__.properties.name
                if (serviceRequestByCountry[country] != undefined) {
                  const { totalRequests, totalValue } = serviceRequestByCountry[country]
                  return tooltip2
                    .html(self.createTooltip({ country, totalRequests, totalValue }))
                    .style("visibility", "visible");
                }
              })
              .on("mousemove", function(event){
                // let coords = d3.pointer(event);
                return tooltip2
                  .style("top", (event.pageY-100)+"px")
                  .style("left",(event.pageX-260)+"px");
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
  .debio-map-tooltip {
    border-radius: 4px;
    font-family: "Roboto", sans-serif !important;
    border: 1px solid #edf0ee;
    padding: 14px;

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
</style>