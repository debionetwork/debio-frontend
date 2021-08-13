# Service Handler

## Feature

- `isLoading`: Indikator loading, jadi kalian gaperlu tambahin lagi `isLoading` di data kalian secara manual lagi
- `isErrors`: Ini bisa kalian gunain buat debug error, bisa juga buat validasi
- `this.dispatch`: Ini bisa di pake buat async request method (Psst.. ini udah handle loading kalian jadi lebih praktis dan presisi)
- `loadingPlaceholder`: Kalo ini kalian bisa gunain buat indikator di placeholder input field

## Cara penggunaan

##### 1. Import ke file .vue kalian
```js
import serviceHandler from "@/mixins/serviceHandler"
```

##### 2. Tambahkan `mixins` ke script kalian
```js
export default {
  name: "xxx",
  components: { xxx, yyy },
 
  mixins: [serviceHandler]
}
```

##### 3. Selanjutnya kalian udah bisa akses fitur fitur service handler, contohnya:

- #### `this.dispatch`
```js
import serviceHandler from "@/mixins/serviceHandler"
import { getOrdersData } from "@/lib/polkadotProvider/query/orders"

export default {
  name: "xxx",
  components: { xxx, yyy },
 
  mixins: [serviceHandler],

  methods: {
    async fetchData() {
      await this.dispatch(getOrdersData, this.api, this.orderId)
    },
  }
}

```

- #### `loadingPlaceholder`
```html
<input :placeholder="loadingPlaceholder">
```
