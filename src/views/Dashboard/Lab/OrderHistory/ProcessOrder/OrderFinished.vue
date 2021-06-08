<template>
    <div>
        <div class="d-flex mb-8 justify-space-between">
            <div style="width: 50%;">
                <b class="secondary--text card-header">Genome Files</b>
                <v-card class="d-flex pa-2 justify-space-between">
                    <b>Genome.txt</b>
                    <v-icon>
                        mdi-eye
                    </v-icon>
                </v-card>
            </div>
            <div class="ml-5" style="width: 50%;">
                <b class="secondary--text card-header">Report Files</b>
                <v-card class="d-flex pa-2 justify-space-between">
                    <b>Report.txt</b>
                    <v-icon>
                        mdi-eye
                    </v-icon>
                </v-card>
            </div>
        </div>
        <v-alert
            type="success"
            >Specimen Processed</v-alert>
    </div>
</template>

<script>
export default {
    name: 'OrderFinished'
}
</script>