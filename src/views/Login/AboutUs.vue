<template>
  <v-menu
    open-on-hover
    bottom
    offset-y
    max-width="400"
    nudge-right="200"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs  }">
      <div
        v-on="on" v-bind="attrs"
        class="text-center mt-2 mb-4"
        style="margin: 0 auto; max-width: 600px;"
      >
        <div class="text-h3 secondary--text"><b>Degenics</b></div>
        <div class="text-body-1" style="color: #B6E8E3;"><b>Decentralized Genetics</b></div>
        <div class="text-h6 white--text mt-2">
          <b>The Privacy-First Platform for Personal Genetic Testing</b>
        </div>
      </div>
    </template>
    <v-card>
      <v-card-title>About Us</v-card-title>
      <v-card-text>
        <div>
          <b>Our Story</b>
        </div>
        <div>
          Degenics is a group of IT consultants, blockchain developers, and biologists who are passionate about privacy, decentralized technologies, and genomic data science.
        </div>
        <div class="mt-3">
          <b>Our Vision</b>
        </div>
        <div>
          We aim to democratize direct-to-consumer genomics with a privacy-preserving, anonymous-first platform running on a fully decentralized, autonomous infrastructure.
        </div>
        <div class="mt-3">
          <b>Demo Application</b>
        </div>
        <div class="mb-3">This demo application is built on top of Hyperledger Besu Ethereum client</div>
        <v-divider></v-divider>
        <div class="mt-3">
          For more information go to our website at 
          <a href="https://www.degenics.com/" target="_blank">www.degenics.com</a>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'AboutUs'
}
</script>

<style>
</style>
