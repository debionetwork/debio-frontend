<template>
  <v-dialog :value="_show" width="500" persistent>
    <v-card>
      <div class="d-flex justify-center pb-5 pt-5">
        <v-img v-bind:src="require('../../assets/'+imgPath)" :max-width="imgWidth" />
      </div>
      <div align="center" class="pb-5" > <b>{{ titleAlert }} </b></div>
      <div align="center" class="pb-5 pl-5 pr-5">{{ textAlert }}</div>
      <div class="d-flex justify-center pb-5">
        <v-col lg="5" md="5" sm="8">
          <Button @click="closeDialog" elevation="2" dark color="primary"> {{ btnText }} </Button>
        </v-col>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import Button from "@/components/Button";

export default {
  name: "DialogAlert",
  components: {
    Button,
  },
  props: {
    show: Boolean,
    titleAlert: String,
    textAlert: String,
    imgPath: String,
    btnText: String,
    imgWidth: String,
  },
  data: () => ({}),
  computed: {
    _show: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("toggle", val);
      },
    },
  },
  methods: {
    closeDialog() {
      this._show = false;
      this.$emit("close");
    },
  },
};
</script>

<style>
</style>

