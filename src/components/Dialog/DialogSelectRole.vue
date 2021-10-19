<template>
  <v-dialog :value="_show" width="500" persistent>
    <v-card>
      <v-card-text>
        <div class="d-flex justify-center pt-3 pb-3 text--darken-1">
          Login As
        </div>
        <hr />
        <v-row class="d-flex justify-center pb-10 mt-5">
          <v-col
            lg="3"
            md="3"
            sm="3"
            align="center"
            style="cursor: pointer"
            @click="closeDialog('lab')"
          >
            <v-img src="@/assets/lab-icon.png" max-width="65" />
            <div>Lab</div>
          </v-col>

          <v-col
            lg="3"
            md="3"
            sm="3"
            align="center"
          >
            <v-img src="@/assets/hospital-icon-gray.png" max-width="65"/>
            <div>Hospital</div>
          </v-col>
          <v-col
            lg="3"
            md="3"
            sm="3"
            align="center"
          >
            <v-img src="@/assets/doctor-icon-gray.png" max-width="65" />
            <div>Doctor</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DialogSelectRole",
  components: {},
  props: {
    show: Boolean,
    textAlert: String,
    imgPath: String,
    btnText: String,
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
    closeDialog(openRole) {
      this._show = false;
      this.$emit("close", { openRole: openRole });
    },
  },
};
</script>

<style>
</style>

