<template>
    <div>
        <ul id="example-1">
            <li v-for="item in countries" :key="item" @click="getCity(item)" >
                {{ item }}
            </li>
        </ul>
        <hr />
        <ul id="example-2">
            <li v-for="item in cities" :key="item" @click="getLab(item)" >
                {{ item }}
            </li>
        </ul>
        <hr />
        <ul id="example-3">
            <li v-for="item in labs" :key="item.labAccount" @click="getService(item)" >
                {{ item.name }}
            </li>
        </ul>
        <hr />
        <ul id="example-4">
            <li v-for="item in services" :key="item.code" >
                {{ item.code }} - {{ item.serviceName }} - {{ item.price }}  
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Dashboard',
    data(){
        return {
            countries: [],
            cities:[],
            labs:[],
            services: [],
            selectCountry: null
        }
    },
    methods:{
        getCity(country){
            this.contractLocation.methods.countCity(country).call()
            .then(count=>{
                this.selectCountry = country;
                this.cities.splice(0, this.cities.length)
                for(let i = 1; i <= count; i++){
                    this.contractLocation.methods.cityByIndex(country, i).call()
                    .then(city=>{
                        console.log(city)
                        this.cities.push(city)
                    })
                }
            })
        },
        getLab(city){
            this.contractDegenics.methods.labCount(this.selectCountry, city).call()
            .then(count=>{
                console.log(count)
                this.labs.splice(0, this.labs.length)
                for(let i = 1; i <= parseInt(count); i++){
                    this.contractDegenics.methods.labByIndex(this.selectCountry, city, i).call()
                    .then(res=>{
                        console.log(res)
                        let {labAccount, name, country, city} = res
                        let o = {labAccount, name, country, city} 
                        this.labs.push(o)
                    })
                }
            })
        },
        getService(parm){
            console.log(parm)
            this.contractDegenics.methods.serviceCount(parm.labAccount).call()
            .then(count=>{
                console.log(count)
                this.services.splice(0, this.services.length)
                for(let i = 1; i <= count; i++){
                    this.contractDegenics.methods.serviceByIndex(parm.labAccount, i).call()
                    .then(res=>{
                        console.log(res)
                        let {code, serviceName, price} = res
                        let o = {code, serviceName, price}
                        this.services.push(o)
                    })
                }
            })
        }
    },
    mounted() {
        this.contractLocation.methods.countCountry().call()
        .then(count =>{
            console.log(count)
            this.countries.splice(0, this.countries.length)
            for(let i = 1; i <= count; i++){
                this.contractLocation.methods.countryByIndex(i).call()
                .then(country=>{
                    console.log(country)
                    this.countries.push(country)
                })
            }
        })
    },
    computed: {
        ...mapState({
            contractLocation: state => state.ethereum.contracts.contractLocation,
            contractDegenics: state => state.ethereum.contracts.contractDegenics,
        }),
    }
}
</script>
