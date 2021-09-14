<template>
    <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="6" lg="8" md="8">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-title class="px-8">
              <div class="text-h5">Detail of your request</div>
            </v-card-title>
            <v-card-text class="px-8 mt-5">
              <template class="text-h6 mb-5">
                <v-row class="text-h6 mb-5" >
                  <v-col cols="4">
                    Country
                  </v-col>
                   <v-col>
                  : {{country[0].name}}
                  </v-col>
                </v-row>
                <v-row class="text-h6 mb-5" >
                  <v-col cols="4">
                    City
                  </v-col>
                   <v-col>
                  : {{city[0][1]}}
                  </v-col>
                </v-row>

                <v-row class="text-h6 mb-5" >
                  <v-col cols="4">
                    Test Category
                  </v-col>
                   <v-col>
                  : {{category}}
                  </v-col>
                </v-row>

                 <v-row class="text-h6 mb-5" >
                  <v-col cols="4">
                    Staking Amount
                  </v-col>
                   <v-col>
                  : {{amount}}
                  </v-col>
                </v-row>

                 <v-row class="text-h6 mb-5" >
                  <v-col cols="4">
                    Request Status
                  </v-col>
                   <v-col>
                  : <span style="color: #DF711B" >{{status}}</span>
                  </v-col>
                </v-row>
              </template>
            </v-card-text>
            <div class="px-8">
              <v-divider></v-divider>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import countryData from "@/assets/json/country.json"
import cityData from "@/assets/json/city.json"

export default {
  name: "ServiceRequest",
  data: () => ({
    country: "",
    city: "",
    category: "",
    status: "Waiting a lab to respond",

  }),
  computed:{
    ...mapState({
      amount: state => state.lab.amount,
    }),
  },
  async mounted () {

    const { city, country, category } = this.$route.params
    const cities = Object.entries(cityData[country].divisions) 
    
    this.category = category
    this.country = countryData.filter((c) => c['alpha-2'] == country)
    this.city = (cities.filter((c) => c[0] == city))    
  },
}
</script>