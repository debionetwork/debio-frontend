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
                        v-model="serviceName"
                    ></v-text-field>
                    
                    <v-text-field
                        dense
                        label="Price"
                        placeholder="Price"
                        outlined
                        v-model="price"
                    ></v-text-field>

                    <v-text-field
                        dense
                        label="Description"
                        placeholder="Description"
                        outlined
                        v-model="description"
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
                        v-model="profileImage"
                    ></v-file-input>

                    <v-btn
                    color="primary"
                    block
                    large
                    @click="updateLab"
                    >Submit</v-btn>
                </v-card-text>
            </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'LabServicesDetail',
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
