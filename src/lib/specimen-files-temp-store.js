import store from "store"

export default {
  set(specimenNumber, filesArr) {
    store.set(`specimenFiles:${specimenNumber}`, filesArr)
  },
  get(specimenNumber) {
    return store.get(`specimenFiles:${specimenNumber}`)
  },
  remove(specimenNumber) {
    store.remove(`specimenFiles:${specimenNumber}`)
  }
}
