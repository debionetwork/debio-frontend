<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
.image-placeholder{
  cursor: pointer;
  border: 1px solid lightgrey;
}
</style>

<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
            <v-card class="dg-card" elevation="0" outlined>
              <v-form ref="addServiceForm">
                <v-card-text class="px-8 pb-8 pt-10">              
                  <div class="mt-5 mb-12 justify-space-evenly" align="center">
                      <v-avatar
                        size="125"
                        @click="selectPicture"
                        rounded
                        class="image-placeholder"
                      >
                        <v-img v-if="!imageUrl" src="@/assets/add-image-placeholder.png" alt="image"></v-img>
                        <v-img v-else :src="imageUrl" alt="image"></v-img>
                        <v-file-input 
                          style="display: none"
                          hide-input
                          prepend-icon="mdi-camera"
                          accept="image/*" 
                          ref="fileInput"
                          @change="imageUploadEventListener" />
                      </v-avatar>

                  </div>
                    <v-select
                    dense
                    label="Service Category"
                    placeholder="Service Category"
                    v-model="category"
                    outlined
                    :items="listCategories"
                    item-text="service_categories"
                    item-value="service_categories"
                    :rules="serviceCategoryRules"
                    ></v-select>

                    <v-select
                    dense
                    label="Type of Biological Sample"
                    placeholder="Type of Biological Sample"
                    v-model="biologicalType"
                    outlined
                    :items="listBiologicalType"
                    item-text="dna_collection_process"
                    item-value="dna_collection_process"
                    :rules="biologicalTypeRules"
                    ></v-select>

                    <v-text-field
                      dense
                      label="Service Name"
                      placeholder="Service Name"
                      outlined
                      v-model="name"
                      :rules="serviceNameRules"
                    ></v-text-field>

                    <div class="d-flex">
                      <v-row>
                        <v-col>
                          <v-select
                          label="Currency"
                          outlined
                          dense
                          max="30"
                          v-model="currencyType"
                          :items="currencyList"
                          :rules="curencyTypeRules"
                          ></v-select>
                        </v-col>
                        <v-col>
                          <v-text-field
                            dense
                            label="Price"
                            placeholder="Price"
                            outlined
                            v-model="price"
                            :rules="priceRules"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-select
                          label="QC Currency"
                          outlined
                          dense
                          v-model="currencyType"
                          :items="currencyList"
                          :rules="qcQurencyTypeRules"
                          ></v-select>
                        </v-col>
                        <v-col>
                          <v-text-field
                            dense
                            label="QC Price"
                            placeholder="QC Price"
                            outlined
                            v-model="qcPrice"
                            :rules="cqPriceRules"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </div>

                    <v-text-field
                      dense
                      label="Short Description"
                      placeholder="Short Description"
                      outlined
                      v-model="description"
                      :rules="descriptionRules"
                    ></v-text-field>
                    
                    <v-row >
                      <v-col cols="8">
                        <v-text-field
                          dense
                          label="Expected Duration"
                          placeholder="Expected Duration"
                          max="30"
                          outlined
                          v-model="expectedDuration"
                          :rules="expectedDurationRules"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-select
                          outlined
                          dense
                          v-model="selectExpectedDuration"
                          :items="listExpectedDuration"
                          :rules="expectedDurationRules"
                        ></v-select>
                      </v-col>
                    </v-row>


                    <v-textarea
                      label="Long Description"
                      placeholder="Long Description"
                      outlined
                      v-model="longDescription"
                      :rules="longDescriptionRules"
                    ></v-textarea>

                    <v-file-input
                      :rules="fileInputRules"
                      accept="image/png, image/jpeg, image/bmp"
                      dense
                      label="Test Result Sample"
                      placeholder="Test Result Sample"
                      prepend-icon="mdi-file-document"
                      outlined
                      v-model="testResultSampleFile"
                      @change="fileUploadEventListener"
                    ></v-file-input>

                    <v-btn
                      color="primary"
                      block
                      large
                      :disabled="isUploading"
                      :loading="isLoading"
                      @click="updateService"
                    >Submit</v-btn>
                </v-card-text>
              </v-form>
            </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { upload } from "@/lib/ipfs"
import { getCategories } from "@/lib/categories"
import { updateService } from '@/lib/polkadotProvider/command/services'

export default {
  name: 'EditLabServices',

  data: () => ({
    name: "",
    category: "",
    price: "",
    qcPrice: "",
    description: "",
    longDescription: "",
    imageUrl: "",
    testResultSampleUrl: "",
    files: [],
    testResultSampleFile:[],
    sampleFiles:[],
    isLoading: false,
    isUploading: false,
    currencyList: ['DAI', 'Ethereum'],
    currencyType: "",
    listExpectedDuration: ['WorkingDays', 'Hours', 'Days'],
    listCategories: [],
    selectExpectedDuration: "",
    expectedDuration: "",
    biologicalType: "",
    listBiologicalType: [
      "Covid 19 Saliva Test",
      "Blood Cells - Dried Blood Spot Collection Process",
      "Epithelial Cells - Buccal Swab Collection Process",
      "Fecal Matters - Stool Collection Process",
      "Saliva - Saliva Collection Process",
      "Urine - Clean Catch Urine Collection Process",
    ]
  }),

  async mounted(){
    await this.getServiceCategory()
    const item = this.$route.params.item
    console.log(item, 'item')
    this.id = item.id
    this.name = item.info.name
    this.price = item.info.prices_by_currency[0].price_components[0].value
    this.qcPrice = item.info.prices_by_currency[0].additional_prices[0].value
    this.currencyType = item.info.prices_by_currency[0].currency.toUpperCase()
    this.description = item.info.description
    this.longDescription = item.info.long_description
    this.imageUrl = item.info.image
    this.testResultSampleUrl = item.info.test_result_sample
    this.expectedDuration = item.info.expected_duration.duration
    this.selectExpectedDuration = item.info.expected_duration.duration_type
    this.category = item.info.category
    this.biologicalType = item.info.dna_collection_process
    
    if(this.imageUrl){
      fetch(this.imageUrl)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
          this.files.push(new File([blob], this.imageUrl.substring(21)))
      });
    }
    
    if(this.testResultSampleUrl){
      fetch(this.testResultSampleUrl)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
          this.testResultSampleFile = new File([blob], this.testResultSampleUrl.substring(21))
      });
    }
  },

  computed: {

    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),

    serviceCategoryRules() {
      return [
        val => !!val || 'Category is Required'
      ]
    },

    biologicalTypeRules() {
      return [
        val => !!val || 'Biologocal type is Require'
      ]
    },

    serviceNameRules() {
      return [
        val => !!val || 'Name is Required',
        val => (val && val.length <= 50) || 'Max 50 Character'
      ]
    },

    curencyTypeRules() {
      return [
        val => !!val || 'Currency Type is Required'
      ]
    },

    priceRules() {
      return [
        val => !!val || 'Price is Required',
        val => /^[0-9]+$/.test(val) || 'Price must be Number'
      ]
    },

    qcQurencyTypeRules() {
      return [
        val => !!val || 'QC Currency Type is Required'
      ]
    },
    
    cqPriceRules() {
      return [
        val => !!val || 'QC Price is Required',
        val => /^[0-9]+$/.test(val) || 'QC Price must be Number'
      ]
    },

    descriptionRules() {
      return [
        val => !!val || 'Description is Required',
        val => (val && val.length >= 50) || 'Min 50 Character',
        val => (val && val.length <= 255) || 'Max 255 Character'
      ]
    },

    longDescriptionRules() {
      return [
        val => !!val || 'Long Description is Required',
        val => (val && val.length >= 500) || 'Max 500 Character',
        val => (val && val.length <= 1000) || 'Max 1000 Character'
      ]
    },

    expectedDurationRules() {
      return [
        val => !!val || 'Expected duration is Required'
      ]
    },

    fileInputRules() {
      return [
        value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!',
      ]
    },

  },

  methods: {

    async getServiceCategory() {
      const { data : data } = await getCategories()
      this.listCategories =  data
    },

    async updateService() {
      if(this.isLoading) return // If function already running return.
      if (!this.$refs.addServiceForm.validate()) {
        return
      }
      this.isLoading = true
      await updateService(
        this.api,
        this.pair,
        this.id,
        {
          name: this.name,
          prices_by_currency: [
            {
              currency: this.currencyType,
              price_components: [
                {
                  component: "component_1",
                  value: this.price
                }
              ],
              additional_prices: [
                {
                  component: "qc_component",
                  value: this.qcPrice
                }
              ],
            },
          ],
          expected_duration: { 
            duration: this.expectedDuration, 
            duration_type: this.selectExpectedDuration
          },
          category: this.category,
          description: this.description,
          test_result_sample: this.testResultSampleUrl,
          long_description: this.longDescription,
          image: this.imageUrl,
          dna_collection_process: this.biologicalType,
        },
        () => {
          this.$router.push('/lab/services')
          this.isLoading = false
        }
      )
    },

    imageUploadEventListener(file) {
      this.isUploading = true
      this.isLoading = true
      this.imageUrl = ""
      if (file) {
        if (file.name.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsArrayBuffer(file)

        const context = this
        fr.addEventListener('load', async () => {
          // Upload
          const uploaded = await upload({
            fileChunk: fr.result,
            fileType: file.type,
            fileName: file.name,
          })
          context.imageUrl = `https://ipfs.io/ipfs/${uploaded.ipfsPath[0].data.path}` // this is an image file that can be sent to server... (convert img to file path)
          context.isUploading = false
          context.isLoading = false
        })
      }
    },

    fileUploadEventListener(file) {
      if (!file || file.size >= 2000000) {
        return
      }
      this.isUploading = true
      this.isLoading = true
      this.testResultSampleUrl = ""
      if (file) {
        if (file.name.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsArrayBuffer(file)

        const context = this
        fr.addEventListener('load', async () => {
          // Upload
          const uploaded = await upload({
            fileChunk: fr.result,
            fileType: file.type,
            fileName: file.name,
          })
          context.testResultSampleUrl = `https://ipfs.io/ipfs/${uploaded.ipfsPath[0].data.path}` // this is an image file that can be sent to server... (convert img to file path)
          context.isUploading = false
          context.isLoading = false
        })
      }
    },

    selectPicture() {
      this.$refs.fileInput.$refs.input.click()
    },

  },
}
</script>