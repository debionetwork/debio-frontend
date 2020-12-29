<template>
    <div>
        
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Dashboard',
    data(){
        return {
            countries: [],
            selectCountry: null
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
            contractLocation: state => state.ethereum.contractLocation
        }),
    }
}
</script>