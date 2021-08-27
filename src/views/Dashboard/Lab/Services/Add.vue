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
                    :rules="[val => !!val || 'Category is Required']"
                    ></v-select>
                    
                    <v-text-field
                      dense
                      label="Service Name"
                      placeholder="Service Name"
                      outlined
                      v-model="name"
                      :rules="[val => !!val || 'Name is Required']"
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
                          :rules="[val => !!val || 'Currency Type is Required']"
                          ></v-select>
                        </v-col>
                        <v-col>
                          <v-text-field
                            dense
                            label="Price"
                            placeholder="Price"
                            outlined
                            v-model="price"
                            :rules="[val => !!val || 'Price is Required']"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-select
                          label="QC Currency"
                          outlined
                          dense
                          v-model="currencyType"
                          :items="currencyList"
                          :rules="[val => !!val || 'QC Currency Type is Required']"
                          ></v-select>
                        </v-col>
                        <v-col>
                          <v-text-field
                            dense
                            label="QC Price"
                            placeholder="QC Price"
                            outlined
                            v-model="qcPrice"
                            :rules="[val => !!val || 'QC Price is Required']"
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
                      :rules="[val => !!val || 'Description is Required']"
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
                          :rules="[val => !!val || 'Expected duration is Required']"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-select
                          outlined
                          dense
                          v-model="selectExpectedDuration"
                          :items="listExpectedDuration"
                          :rules="[val => !!val || 'Expected duration is Required']"
                        ></v-select>
                      </v-col>
                    </v-row>


                    <v-textarea
                      label="Long Description"
                      placeholder="Long Description"
                      outlined
                      v-model="longDescription"
                    ></v-textarea>

                    <v-file-input
                      :rules="rules"
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
                      @click="createService"
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
import { createService } from '@/lib/polkadotProvider/command/services'

export default {
  name: 'AddLabServices',
  data: () => ({
    category: '',
    name: '',
    price: '',
    qcPrice: '',
    description: '',
    longDescription: '',
    imageUrl: "",
    testResultSampleUrl: "",
    files: [],
    testResultSampleFile:[],
    listCategories:[],
    sampleFiles:[],
    isLoading: false,
    isUploading: false,
    currencyList: ['DAI', 'Ethereum'],
    currencyType: 'DAI',
    listExpectedDuration: ['WorkingDays', 'Hours', 'Days'],
    selectExpectedDuration: 'WorkingDays',
    expectedDuration: '',
    rules: [
      value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!',
    ],
  }),
  async mounted() {
    this.prefillValues()
    this.listCategories = [
      "Bioinformatics Data Analysis Support & Genetic Counseling", 
      "Covid-19 Testing", 
      "Single Nucleotide Polymorphism (SNP) Microarray", 
      "Targeted Gene Panel Sequencing",
      "Whole-Exome Sequencing",
      "Whole-Genome Sequencing",
      "Whole-Transcriptome Sequencing",
      "Others"
    ];
  },
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
  },
  methods: {
    prefillValues() {
      if (!this.$route.params) return

      const {
        name,
        category,
        qcValue,
        currencyValue,
        currencyType,
        descriptionShort,
        descriptionLong,
        durationType,
        durationValue
      } = this.$route.query

      this.name = name
      this.category = category
      this.price = currencyValue
      this.qcPrice = qcValue
      this.description = descriptionShort
      this.longDescription = descriptionLong
      this.currencyType = currencyType
      this.selectExpectedDuration = durationType
      this.expectedDuration = durationValue
    },
    async createService() {
      if(this.isLoading) return // If function already running return.
      if (!this.$refs.addServiceForm.validate()) {
        return
      }
      this.isLoading = true
      await createService(
        this.api,
        this.pair,
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