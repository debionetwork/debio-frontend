<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
            <v-card class="dg-card" elevation="0" outlined>
              <v-form ref="addServiceForm">
                <v-card-text class="px-8 pb-8 pt-10">              
                    <v-text-field
                      dense
                      label="Service Name"
                      placeholder="Service Name"
                      outlined
                      v-model="name"
                      :rules="[val => !!val || 'Name is Required']"
                    ></v-text-field>
                    
                    <v-text-field
                      dense
                      label="Price (DAIC)"
                      placeholder="Price"
                      type="number"
                      max="30"
                      outlined
                      v-model="price"
                      :rules="[val => !!val || 'Price is Required']"
                    ></v-text-field>

                    <v-text-field
                      dense
                      label="Description"
                      placeholder="Description"
                      outlined
                      v-model="description"
                      :rules="[val => !!val || 'Description is Required']"
                    ></v-text-field>
                    
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
    description: '',
    longDescription: '',
    imageUrl: "",
    files: [],
    isLoading: false,
    isUploading: false,
    rules: [
      value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!',
    ],
  }),
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
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
          price: this.price,
          image: this.imageUrl,
          description: this.description,
          long_description: this.longDescription
        },
        () => {
          this.$router.push('/lab/services')
          this.isLoading = false
        }
      )
    },
    fileUploadEventListener(file) {
      this.isUploading = true
      this.isLoading = true
      if (file && file.size < 2000000 ) {
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
          context.imageUrl = `https://ipfs.io/ipfs/${uploaded.ipfsPath[0].data.path}` // this is an image file that can be sent to server...
          context.isUploading = false
          context.isLoading = false
        })
      }
      else {
        this.files = []
        this.imageUrl = ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
