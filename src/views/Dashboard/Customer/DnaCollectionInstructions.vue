<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <Card>
            <template v-slot:title> DNA Collection Process </template>
            <template v-slot:text>
              <v-row v-for="(item, i) in instructions" :key="i" class="mb-2">
                <v-col cols="1" class="pl-6">
                  <BulletPoint>{{ i + 1 }}</BulletPoint>
                </v-col>
                <v-col class="pl-4">
                  <div v-html="item" class=""></div>
                </v-col>
              </v-row>
            </template>
            <template v-slot:actions>
              <v-btn
                depressed
                color="primary"
                large
                width="100%"
                @click="goToOrderDetail"
              >
                Go back to my order
              </v-btn>
            </template>
          </Card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Card from "@/components/Card";
import BulletPoint from "@/components/BulletPoint";

export default {
  name: "DNACollectionInstructions",
  components: {
    Card,
    BulletPoint,
  },
  computed: {
    instructions() {
      return [
        `Refrain from eating, drinking, chewing gum, brushing teeth, or smoking for at least 60 minutes before sample collection.`,
        `Rinse your mouth with water. Make sure you swish the water for at least 30 seconds before spitting it out. Repeat. Observe the color. If the water appears colored, repeat rinsing with water until clear.`,
        `Wash your hands prior to handling tube or cotton swab to avoid contamination.`,
        `Put on gloves and wear them throughout the entire collection procedure to protect DNA integrity.`,
        `Carefully take clean cotton swab, avoid touching the tip to any surface.`,
        `Using the same force as brushing your teeth, rub and rotate the swab along the inside of each cheek for 30 seconds (1 minute total per swab), ensuring that the entire swab tip has made contact with the cheek to ensure maximum cell collection.`,
        `Remove swab, do not touch swab tip against teeth, lips, or other surfaces.`,
        `Allow the swabs a MINIMUM of 60 minutes to dry. Place the swab somewhere clean, ensuring that the end of the swab is not touching anything else.`,
        `Put the dried swab directly into the collection tube.`,
      ];
    },
  },
  methods: {
    goToOrderDetail() {
      this.$router.push({
        name: "order-history-detail",
        params: { number: this.$route.params["number"] },
      });
    },
  },
};
</script>

<style lang="scss">
</style>