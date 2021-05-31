<template>
  <v-dialog :value="_show" width="500" persistent>
    <v-card class="pb-5">
      <div v-if="loading">
        <div class="mt-10 mb-10" align="center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </div>
      <div v-if="filePending && !loading">
        <v-app-bar flat dense color="white">
          <v-toolbar-title class="title"> Upload EMR </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <hr />
        <div class="pl-5 pt-5 pr-5">
          <div class="align-center mb-5">Add File(s)</div>
          <div v-for="dataEMR in listPendingUploadFile" :key="dataEMR.title">
            <v-card
              class="dg-card pb-2 pt-2 mb-2"
              style="background: #ffffff"
              elevation="0"
              outlined
            >
              <div class="ml-5 mr-5">
                <v-row class="align-center">
                  <v-col cols="12" lg="11" md="11" xl="11">
                    <div class="align-center subtitle-2">
                      {{ dataEMR.title }}
                    </div>
                  </v-col>
                  <v-col cols="12" lg="1" md="1" xl="1">
                    <v-btn icon @click="removePending(dataEMR)">
                      <v-icon :size="20">mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <div class="align-center caption mb-3">{{ dataEMR.desc }}</div>
                <v-row class="align-center">
                  <v-col cols="12" lg="1" md="1" xl="1">
                    <v-icon :size="35" color="#BA8DBB"
                      >mdi-file-document</v-icon
                    >
                  </v-col>
                  <v-col cols="12" lg="11" md="11" xl="11">
                    <div class="align-center caption">
                      {{ dataEMR.file.name }}
                      <v-row class="align-center">
                        <v-col cols="12" lg="11" md="11" xl="11">
                          <v-card
                            elevation="0"
                            width="100%"
                            color="success"
                            height="10"
                          ></v-card>
                        </v-col>
                        <v-col cols="12" lg="1" md="1" xl="1">
                          <v-icon :size="20" color="success"
                            >mdi-check-circle</v-icon
                          >
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </div>
          <v-card
            class="dg-card pb-2 pt-2"
            style="background: #ffffff"
            elevation="0"
            outlined
            @click="addFile()"
          >
            <div class="ml-5 mr-5">
              <div align="center" class="align-center mb-2">
                <v-icon color="#989898" class="align-center" :size="30">
                  mdi-plus
                </v-icon>
              </div>
              <div
                align="center"
                class="align-center mb-2"
                style="color: #989898; font-weight: bold"
              >
                Add File
              </div>
            </div>
          </v-card>

          <div class="mt-10">
            <v-btn
              depressed
              color="primary"
              large
              width="100%"
              @click="uploadEMRData"
              :disabled="listPendingUploadFile.length < 1 || isLoading"
            >
              Upload
            </v-btn>
          </div>
        </div>
      </div>
      <div v-if="openFormEMR && !loading">
        <v-app-bar flat dense color="white">
          <v-toolbar-title class="title"> Add EMR File </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeForm">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <hr />
        <div v-if="!loading" class="pl-5 pt-5 pr-5">
          <div class="mb-0">
            <div class="align-center mb-1">Title</div>
            <v-text-field
              dense
              label="Title"
              placeholder="Title"
              outlined
              v-model="formTitle"
            ></v-text-field>
          </div>
          <div class="mb-2">
            <div class="align-center mb-1">Description</div>
            <v-textarea
              v-model="formDescription"
              dense
              label="Description"
              placeholder="Description"
              outlined
              rows="3"
              row-height="25"
            ></v-textarea>
          </div>
          <div class="mb-2">
            <label>
              <input
                type="file"
                id="file"
                ref="file"
                v-on:change="handleFileUpload()"
              />
            </label>
          </div>
          <div class="mt-10">
            <v-btn
              depressed
              color="primary"
              large
              width="100%"
              @click="addToPending"
              :disabled="formFilePath == null || formTitle == '' || isLoading"
            >
              Add
            </v-btn>
          </div>
        </div>
      </div>
      <div v-if="inputPassword && !loading">
        <v-app-bar flat dense color="white">
          <v-toolbar-title class="title"></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeForm">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <div class="mt-2 mb-2 ml-10 mr-10">
          <div class="align-center">
            Please enter your password to encrypt the file (s)
          </div>
          <!-- Prompt password to sign transaction -->
          <v-text-field
            class="mt-2"
            outlined
            auto-grow
            type="password"
            @keyup.enter="onSubmit"
            v-model="password"
            label="Input your password"
            :disabled="isLoading"
          >
          </v-text-field>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
          ></v-progress-linear>
          <div class="">
            <v-btn
              depressed
              color="primary"
              large
              width="100%"
              @click="onSubmit"
              :disabled="!password || isLoading"
            >
              Continue
            </v-btn>
          </div>
        </div>
      </div>
      <div v-if="resultUpload && !loading" class="pb-5 pt-5">
        <div align="center" class="align-center mb-2">
          <v-icon :size="70" color="success">{{ uploadSuccessIcon }}</v-icon>
        </div>
        <div align="center" class="align-center mb-5">
          {{ uploadSuccessTitle }}
        </div>
        <div align="center" class="align-center">
          <v-btn
            depressed
            color="primary"
            large
            width="50%"
            @click="closeDialog"
          >
            Continue
          </v-btn>
        </div>
      </div>
      <div v-if="error" class="pb-5 pt-5 ml-10 mr-10">
        <v-alert dense text type="error">
          {{ error }}
        </v-alert>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "UploadEMR",
  props: {
    show: Boolean,
  },
  data: () => ({
    formTitle: "",
    formDescription: "",
    formFilePath: null,
    listPendingUploadFile: [],
    filePending: true,
    openFormEMR: false,
    loading: false,
    inputPassword: false,
    resultUpload: false,
    password: "",
    isLoading: false,
    error: "",
    uploadSuccessIcon: "mdi-check-circle",
    uploadSuccessTitle: "Upload Successful",
  }),
  computed: {
    _show: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("toggle", val);
      },
    },
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
    }),
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setMetamaskAddress: "metamask/SET_WALLET_ADDRESS",
    }),
    addFile() {
      this.filePending = false;
      this.openFormEMR = true;
      this.formTitle = "";
      this.formDescription = "";
      this.formFilePath = null;
    },
    closeForm() {
      this.inputPassword = false;
      this.filePending = true;
      this.openFormEMR = false;
      this.formTitle = "";
      this.formDescription = "";
      this.formFilePath = null;
      console.log(this.listPendingUploadFile);
    },
    handleFileUpload() {
      this.formFilePath = this.$refs.file.files[0];
    },
    addToPending() {
      this.listPendingUploadFile.push({
        title: this.formTitle,
        desc: this.formDescription,
        file: this.formFilePath,
      });
      this.closeForm();
    },
    removePending(data) {
      const index = this.listPendingUploadFile
        .map(function (e) {
          return e.title;
        })
        .indexOf(data.title);
      if (index > -1) {
        this.listPendingUploadFile.splice(index, 1);
      }
    },
    uploadEMRData() {
      this.inputPassword = true;
      this.filePending = false;
    },
    async onSubmit() {
      this.isLoading = true;
      this.inputPassword = false;
      this.resultUpload = true;
      this.isLoading = false;
      this.error = "";
    },
    closeDialog() {
      this._show = false;
      this.listPendingUploadFile = [];
      this.password = "";
      this.error = "";
      this.loading = false;
      this.openFormEMR = false;
      this.filePending = true;
      this.inputPassword = false;
      this.resultUpload = false;
    },
  },
};
</script>

<style>
</style>