<template>
  <div class="bullet-point">
    <slot></slot>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.bullet-point {
  font-weight: bold;
  color: white;
  background-color: #757575;
  border-radius: 50%;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>