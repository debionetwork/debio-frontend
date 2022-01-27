<template>
  <div class="loading-screen">
    <svg class="loading-screen__icon" width="187" height="85" viewBox="0 0 187 85" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 52H38.9573C39.2958 52 39.6113 51.8288 39.7958 51.545L44.6088 44.1402C45.1046 43.3775 46.2786 43.6192 46.4328 44.5157L52.8931 82.0659C53.0871 83.194 54.7172 83.1641 54.8697 82.0296L65.5734 2.39365C65.7273 1.24859 67.3781 1.23342 67.553 2.37546L74.5142 47.8277C74.6627 48.7975 75.9735 48.9957 76.4021 48.1132L82.5477 35.4605C82.9214 34.6913 84.0256 34.7156 84.3651 35.5005L91.2392 51.3969C91.3975 51.763 91.7582 52 92.1571 52H124.689C125.161 52 125.57 51.6688 125.667 51.206L132.516 18.6724C132.739 17.6127 134.253 17.6143 134.474 18.6745L142.872 58.9867C143.07 59.9351 144.366 60.0765 144.763 59.1931L151.805 43.5451C152.117 42.8509 153.06 42.7464 153.517 43.3555L159.7 51.6C159.889 51.8518 160.185 52 160.5 52H186.5" stroke="#FF94E7" stroke-width="3"/>
    </svg>
    <h5 class="loading-screen__loading-text">LOADING</h5>
    <p class="loading-screen__loading-description">It will take a few seconds</p>
  </div>
</template>

<script>
export default {
  name: "LoadingScreen",
}
</script>

<style lang="sass">
  .loading-screen
    height: 100vh
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center

    &__icon
      margin-bottom: 1.5rem
      stroke-dasharray: 1000
      stroke-dashoffset: 1000
      animation: dash linear 3s forwards infinite

    &__loading-text
      margin-bottom: 1rem
      font-family: "Open Sans", sans-serif
      font-weight: 600 !important
      font-size: 1.5rem !important
      line-height: 2.25rem !important

    &__loading-description
      font-family: "Open Sans", sans-serif
      font-size: 1rem !important
      line-height: 150% !important

    @keyframes dash
      to
        stroke-dashoffset: 0
</style>
