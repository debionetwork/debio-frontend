<template>
  <v-dialog :value="_show" max-width="500" persistent>
    <v-card>
      <div class="d-flex justify-center pb-5 pt-8">
        <v-img src="@/assets/icon-demo.png" max-width="30%" />
      </div>
      <div align="center" class="pb-5 pr-8 pl-8 font-weight-bold">
        This is a demo version for testing purposes and is not audited. <br />We're still working
        on this site and will have more information available to you soon.
      </div>
      <div class="d-flex justify-center pb-5">
        <v-col cols="12" lg="11" md="11" sm="11">
          <Button @click="closeDialog" elevation="2" dark> Continue </Button>
        </v-col>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import Button from "@/components/Button";

export default {
  name: "LandingDemo",
  components: {
    Button,
  },
  props: {
    show: Boolean,
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

