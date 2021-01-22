<template>
  <component v-bind:is="cardButtonComponent" :disabled="disabled" @click="onClick">
    <slot></slot>
   </component>
</template>

<script>
import EnabledCardButton from './EnabledCardButton'
import DisabledCardButton from './DisabledCardButton'

export default {
  name: 'CardButton',
  components: {
    EnabledCardButton,
    DisabledCardButton
  },
  props: {
    disabled: Boolean,
  },
  computed: {
    cardButtonComponent() {
      return this.disabled ? 'DisabledCardButton' : 'EnabledCardButton'
    }
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style>

</style>
