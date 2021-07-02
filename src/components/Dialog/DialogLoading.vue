<template>
  <v-dialog :value="_show" width="250" persistent>
    <v-card color="white" dark class="pr-3 pl-3 pt-3">
      <v-card-text class="grey--text">
        {{ text }}
        <v-progress-linear
          indeterminate
          color="primary"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "DialogLoading",
  components: {},
  props: {
    show: Boolean,
  },
  data: () => ({
    text: "",
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
      loadingData: (state) => state.auth.loadingData,
    }),
  },
  watch: {
    loadingData() {
      if (this.loadingData != null) {
        this.text = this.loadingData.loadingText;
        if (!this.loadingData.loading) {
          this.closeDialog();
        }
      }
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

