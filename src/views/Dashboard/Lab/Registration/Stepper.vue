<template>
    <v-card class="stepper-card">
        <div>
            You need to complete all the steps to create a service
        </div>
        <Stepper
            size="medium"
            :stepper-items="stepperItems"
        />
    </v-card>
</template>

<script>
import Stepper from "@/components/Stepper"

export default {
  name: 'StepperRegistration',

  components: { Stepper },

  props: {
    stepperItems: Array
  }
}
</script>

<style lang="scss">
.stepper-card {
  width: 400px;
  left: 0px;
  top: 0px;
  border-radius: 8px;
  padding-bottom: 20px;

  & > div {
    font-size: 18px;
    font-weight: 500;
    padding: 20px 20px 0 20px;
  }
}
</style>