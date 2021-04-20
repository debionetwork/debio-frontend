import { Keyring } from '@polkadot/keyring'

export class Lab{
    constructor(){
        this.accountId = ""
        this.name = ""
        this.country = ""
        this.city = ""
        this.address = ""
        this.latitude = ""
        this.longitude = ""
        this.profileImage = ""
        this.services = []
    }
    parseMap(map){
        const keyring = new Keyring()
        for (const [key, value] of Object.entries(map)) {
            if(key === "account_id"){
                this.accountId = keyring.encodeAddress(value, 42)
            }
            else if(value != undefined){
                if(!(value.valueOf() instanceof Object)){
                    this[key] = value.valueOf()
                }
                else if(value.valueOf() instanceof Array){
                    this.parseServicesArray(value.valueOf())
                }
            }
        }
    }
    parseServicesArray(array){
        for(let i = 0; i < array.length; i++){
            if(!(array[i].valueOf() instanceof Object)){
                this.services.push(array[i].valueOf())
            }
        }
    }
}