import { Keyring } from '@polkadot/keyring'

class ServiceInfo{
    constructor(){
        this.name = ""
        this.price = 0
        this.category = ""
        this.description = ""
        this.longDescription = ""
        this.image = ""
    }
    parseMap(map){
        for (const [key, value] of Object.entries(map)) {
            if(!(value.valueOf() instanceof Object)){
                this[key] = value.valueOf()
            }
        }
    }
}

export class Service{
    constructor(){
        this.id = ""
        this.ownerId = ""
        this.info = new ServiceInfo()
    }
    parseMap(map){
        const keyring = new Keyring()
        for (const [key, value] of Object.entries(map)) {
            if(key === "owner_id"){
                this.ownerId = keyring.encodeAddress(value, 42)
            }
            else if(key === "id"){
                if(!(value.valueOf() instanceof Object)){
                    this[key] = value.valueOf()
                }
            }
            else if(key === "info"){
                this.parseServiceInfo(value)
            }
        }
    }
    parseServiceInfo(map){
        this.info.parseMap(map)
    }
}