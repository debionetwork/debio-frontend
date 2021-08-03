<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
            <v-card class="dg-card" elevation="0" outlined>
              <v-form ref="addServiceForm">
                <v-card-text class="px-8 pb-8 pt-10">              
                  <div class="mt-5 mb-12 justify-space-evenly" align="center">
                    <!-- <v-btn
                      rounded
                      depresed
                      icon
                      @click="selectPincture"
                      
                    > -->
                      <v-avatar
                        color="grey"
                        size="125"
                        @click="selectPincture"
                        rounded

                      >
                      <!-- <v-btn></v-btn> -->
                      <v-img :src="getImgLink()" alt="image"></v-img>
                        <input 
                          type="file" 
                          style="display: none" 
                          accept="image/*" 
                          ref="fileInput"
                          
                          @change="fileUploadEventListener">
                        <!-- <v-file-input
                          style="display: none"
                          dense
                          label="Image"
                          placeholder="Image"
                          prepend-inner-icon="mdi-image"
                          outlined
                          hide-input
                          v-model="files"
                          @change="fileUploadEventListener"
                          ref="fileInput"
                        ></v-file-input> -->
                      </v-avatar>
                    <!-- </v-btn> -->

                  </div>
                    <v-text-field
                      dense
                      label="Service Name"
                      placeholder="Service Name"
                      outlined
                      v-model="name"
                      :rules="[val => !!val || 'Name is Required']"
                    ></v-text-field>

                    <div class="d-flex justify-space-evenly align-center">
                      <v-row align="center">
                        <div class="d-flex justify-space-evenly align-center mr-3">
                          <v-col cols="12" sm="5">
                            <v-select
                            label="Price"
                            outlined
                            dense
                            max="30"
                            v-model="selecPrice"
                            :items="listPrice"
                            :rules="[val => !!val || 'Price is Required']"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="7">
                            <v-text-field
                              dense
                              placeholder="Price"
                              max="30"
                              outlined
                              v-model="price"
                              :rules="[val => !!val || 'Price is Required']"
                            ></v-text-field>
                          </v-col>
                        </div>
                      </v-row>
                      <v-row align="center">
                        <div class="d-flex justify-space-evenly align-center ml-3">
                          <v-col cols="12" sm="5">
                            <v-select
                            label="QC Price"
                            outlined
                            dense
                            v-model="selecQCprice"
                            :items="listPrice"
                            :rules="[val => !!val || 'QC Price is Required']"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="7">
                            <v-text-field
                              dense
                              placeholder="QC Price"
                              max="30"
                              outlined
                              v-model="qcPrice"
                              :rules="[val => !!val || 'QC Price is Required']"
                            ></v-text-field>
                          </v-col>
                        </div>
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
                    
                    <div class="d-flex justify-space-evenly align-center">
                      <v-row align="center">
                        <v-col cols='12' sm="8">
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
                        <v-col cosl="12" sm="4">
                          <v-select
                            outlined
                            dense
                            v-model="selecExpectedDuration"
                            :items="listExpectedDuration"
                            :rules="[val => !!val || 'Expected duration is Required']"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </div>


                    <v-textarea
                      label="Long Description"
                      placeholder="Long Description"
                      outlined
                      v-model="longDescription"
                    ></v-textarea>
                    
                    <div class="d-flex justify-space-evenly align-center">
                      <v-row align="center">
                        <v-col cols='12' sm="8">
                          <v-text-field
                              dense
                              label="Test Result Sample"
                              placeholder="Test Result Sample"
                              outlined
                              v-model="testResultSampleFile"
                            ></v-text-field>
                        </v-col>
                        <v-col cosl="12" sm="4">
                          <v-btn 
                            top
                            block
                            depressed
                            small
                            >
                            Choose File
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>

                    <v-file-input
                      dense
                      label="Image"
                      placeholder="Image"
                      prepend-icon="mdi-image"
                      outlined
                      v-model="files"
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
    name: '',
    price: '',
    qcPrice: '',
    description: '',
    longDescription: '',
    imageUrl: "",
    // imageUrl: "https://cdn.vuetifyjs.com/images/profiles/marcus.jpg",
    // imageStatus: false, //
    files: [],
    testResultSampleFile:[],//test result sample file
    sampleFiles:[],// test result sample file (maybe)
    isLoading: false,
    isUploading: false,
    listPrice: ['DAI', 'Ethereum'],
    selecPrice: '',
    selecQCprice: '',
    listExpectedDuration: ['WorkingDays', 'Hours', 'Days'],
    selecExpectedDuration:'',
    expectedDuration: '',
  }),
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
    loadAvatar() {
      return this.getImgLink()
    }
  },
  methods: {
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
          // price: this.price,
          price: { currency: this.selecPrice, total_price: this.price},
          qc_price: { currency: this.selecQCprice, total_price: this.qcPrice},
          image: this.imageUrl,
          description: this.description,
          long_description: this.longDescription,
          expected_duration: { expected_duration: this.expectedDuration, type: this.selecExpectedDuration}
        },
        () => {
          this.$router.push('/lab/services')
          this.isLoading = false
        }
      )
    },
    fileUploadEventListener(file) {
      let input  = file.target.files
      file = input[0]
      console.log(this.imageUrl, '<======= imageUrl sebelum')
      console.log(file, ' <===== file')
      this.isUploading = true
      this.isLoading = true
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
          this.imageUrl = `https://ipfs.io/ipfs/${uploaded.ipfsPath[0].data.path}` // this is an image file that can be sent to server... (convert img to file path)
          context.isUploading = false
          context.isLoading = false
        })
      }
      else {
        this.files = []
        this.imageUrl = ''
      }
      console.log(this.imageUrl, '<===== imageUrl sesudah')
    },
    selectPincture() {
      console.log('pencet')
      console.log(this.imageUrl)
      this.$refs.fileInput.click()
    },
    getImgLink() {
      console.log('masuk ke getImgLink');
      console.log(this.imageUrl)
      let img = this.imageUrl
      return img
    },
    testingInput() {
      const input = {}
      const price = {
        currency: this.selecPrice,
        total_price: this.price
      }
      const qcPrice = {
        currency: this.selecQCprice,
        total_price: this.qcPrice
      }
      input.name = this.name
      input.price = price
      input.qc_price = qcPrice
      input.description = this.description
      input.long_description = this.longDescription
      input.expected_duration = this.expectedDuration + this.selecExpectedDuration

      console.log(input, 'input')
    }
  },
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
