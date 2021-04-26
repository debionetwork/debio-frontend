import { Keyring } from '@polkadot/keyring'
import { u8aToHex } from '@polkadot/util'

export class Order {
  constructor() {
    this.id = ""
    this.service_id = ""
    this.customer_id = ""
    this.seller_id = ""
    this.dna_sample_tracking_id = ""
    this.status = ""
    this.created_at = ""
    this.updated_at = ""
  }
  parseMap(map) {
    const keyring = new Keyring()
    for (const [key, value] of Object.entries(map)) {
      if (key === "customer_id") {
        this.customer_id = keyring.encodeAddress(value, 42)
      }
      else if (key === "seller_id") {
        this.seller_id = keyring.encodeAddress(value, 42)
      }
      else if (key === "id") {
        this.id = u8aToHex(value)
      }
      else if (key === "service_id") {
        this.service_id = u8aToHex(value)
      }
      else if (value != undefined) {
        if (!(value.valueOf() instanceof Object)) {
          this[key] = value.valueOf()
        }
        else if (value.valueOf() instanceof Array) {
          this.parseServicesArray(value.valueOf())
        }
      }
    }
  }
  parseServicesArray(array) {
    for (let i = 0; i < array.length; i++) {
      if (!(array[i].valueOf() instanceof Object)) {
        this.services.push(array[i].valueOf())
      }
    }
  }
}