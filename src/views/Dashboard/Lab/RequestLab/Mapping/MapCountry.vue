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
      currentProvince: null
    }
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

    renderD3() {
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
          .style("position", "absolute")
          .style("visibility", "hidden")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "1px")
          .style("border-radius", "5px")
          .style("padding", "10px")
          .html("<p>I'm a tooltip written in HTML</p><img src='https://github.com/holtzy/D3-graph-gallery/blob/master/img/section/ArcSmal.png?raw=true'></img><br>Fancy<br><span style='font-size: 40px;'>Isn't it?</span>")        

      Promise.all([
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
        d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) {
          data.set(d.code, +d.pop)
        })]).then(function(loadData){
          let topo = loadData[0]

          // eslint-disable-next-line no-unused-vars
          let onClickedArea = function(event) {
            d3.selectAll(".Country")
              .transition()
              .duration(200)
              .style("opacity", .5)
            d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", 1)
              .style("stroke", "black")

            let coords = d3.pointer(event)
            
            return tooltip2
              .style("visibility", "visible")
              .style("top", (coords[1] + 80)+"px")
              .style("left",(coords[0] - 80)+"px")
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
      })
    }
  }
}

</script>

<style lang="scss">

</style>