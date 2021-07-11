<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
            <v-container
                class="d-flex flex-row-reverse"
            >
                <v-btn
                  color="light-blue"
                  class="mb-5 white--text"
                  @click="deleteService"
                  :disabled="isLoading"
                  :loading="isDeleteLoading"
                >
                    <v-icon 
                      inline
                      color="white"
                      :size="20"
                    >mdi-delete</v-icon>
                    Delete
                </v-btn>
            </v-container>
            <v-card class="dg-card" elevation="0" outlined>
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
                      label="Price"
                      placeholder="Price"
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
                      :disabled="isDeleteLoading || isUploading"
                      :loading="isLoading"
                      @click="updateService"
                    >Submit</v-btn>
                </v-card-text>
            </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ipfsWorker from '@/web-workers/ipfs-worker'
import { updateService, deleteService } from '@/lib/polkadotProvider/command/services'

export default {
  name: 'LabAddServices',
  data: () => ({
    id: "",
    name: "",
    price: "",
    description: "",
    longDescription: "",
    imageUrl: "",
    files: [],
    isLoading: false,
    isUploading: false,
    isDeleteLoading: false,
  }),
  mounted(){
    const item = this.$route.params.item
    this.id = item.id
    this.name = item.info.name
    this.price = item.info.price
    this.description = item.info.description
    this.longDescription = item.info.long_description
    this.imageUrl = item.info.image
    
    if(this.imageUrl){
      fetch(this.imageUrl)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
          this.files.push(new File([blob], this.imageUrl.substring(21)))
      });
    }
  },
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
  },
  methods: {
    async updateService() {
      if(this.isLoading) return // If function already running return.
      this.isLoading = true
      await updateService(
        this.api,
        this.pair,
        this.id,
        {
          name: this.name,
          price: this.price,
          image: this.imageUrl,
          category: 'genetics',
          description: this.description,
          long_description: this.longDescription
        },
        () => {
          this.$router.push('/lab/services')
          this.isLoading = false
        }
      )
    },
    async deleteService() {
      if(this.isDeleteLoading) return // If function already running return.
      this.isDeleteLoading = true
      await deleteService(
        this.api,
        this.pair,
        this.id,
        () => {
          this.$router.push('/lab/services')
          this.isDeleteLoading = false
        }
      )
    },
    fileUploadEventListener(file) {
      if (file) {
        this.isUploading = true
        this.isLoading = true
        if (file.name.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsArrayBuffer(file)

        const context = this
        fr.addEventListener('load', async () => {
          // Upload
          const uploaded = await context.upload({
            fileChunk: fr.result,
            fileType: file.type,
            fileName: file.name,
          })
          context.imageUrl = `https://ipfs.io/ipfs/${uploaded.ipfsPath[0].data.path}` // this is an image file that can be sent to server...
          this.isUploading = false
          this.isLoading = false
        })
      }
      else {
        this.files = []
        this.imageUrl = ''
      }
    },
    upload({ fileChunk, fileName, fileType }) {
      const chunkSize = 10 * 1024 * 1024 // 10 MB
      let offset = 0
      const blob = new Blob([ fileChunk ], { type: fileType })

      return new Promise((resolve, reject) => {
        try {
          const fileSize = blob.size
          do {
            let chunk = blob.slice(offset, chunkSize + offset);
            ipfsWorker.workerUpload.postMessage({
              seed: chunk.seed, file: blob
            })
            offset += chunkSize
          } while((chunkSize + offset) < fileSize)
          
          let uploadSize = 0
          const uploadedResultChunks = []
          ipfsWorker.workerUpload.onmessage = async event => {
            uploadedResultChunks.push(event.data)
            uploadSize += event.data.data.size
              
            if (uploadSize >= fileSize) {
              resolve({
                fileName: fileName,
                fileType: fileType,
                ipfsPath: uploadedResultChunks
              })
            }
          }

        } catch (err) {
          reject(new Error(err.message))
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
