<template>
  <Card>
    <template v-slot:text>
      <div class="pt-2">
      <v-row v-for="(item, i) in requirements" :key="i" class="mb-2 ">
        <v-col cols="1" class="pl-2">
          <BulletPoint>{{ i + 1 }}</BulletPoint>
        </v-col>
        <v-col class="pl-0">
          <div v-html="item" class=""></div>
        </v-col>
      </v-row>
      </div>
    </template>
  </Card>
</template>

<script>
import Card from '@/components/Card'
import BulletPoint from '@/components/BulletPoint'

export default {
  name: 'DnaCollectionRequirements',
  components: {
    Card,
    BulletPoint,
  },
  data: () => ({
    requirements: [
      'Cotton Bud',
      'Collection Tube',
      'Gloves (Optional)',
      'Envelope'
    ]
  })
}
</script>

<style>

</style>
