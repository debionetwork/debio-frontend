<template>
    <div>
        <v-container>
            <DialogErrorBalance :show="isShowError" @close="closeDialog" />
            <Dialog :show="showActiveOrder" :showClose="false" :width="330">
                <template v-slot:body>
                    <div class="text-center">
                        <h2 class="mb-8">Admin Dashboard</h2>
                        <v-icon class="mb-8" inline color="primary" :size="100">
                            mdi-alert-circle-outline
                        </v-icon>
                    </div>
                    <p>
                        You still have active orders to complete. Resume any pending orders
                        before continuing with this process.
                    </p>
                </template>
                <template v-slot:actions>
                    <Button elevation="2" color="primary" :to="{ name: 'lab-dashboard' }" dark>
                        Go to Dashboard
                    </Button>
                </template>
            </Dialog>
            <v-row>
                <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
                    <v-card class="dg-card" elevation="0" outlined>
                        <v-card-text class="px-8 mt-5">
                            <div class="d-flex justify-space-between align-center">
                                <div class="secondary--text text-h6">
                                    <b>Menstrual Calender Admin Pricing</b>
                                </div>
                                <v-btn small dark color="#75DEE4" fab style="border-radius:10px;"
                                    @click="isEditable = !isEditable">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </div>

                            <v-form class="mt-5" ref="form">
                                <label style="font-size: 12px;"> Monthly </label>
                                <v-text-field dense placeholder="4200 USD" autocomplete="off" outlined :disabled="!isEditable || isLoading
                                    " v-model="document.monthly_price"></v-text-field>

                                <label style="font-size: 12px;"> Quarterly Price </label>
                                <v-text-field dense placeholder="5600 USD" autocomplete="off" outlined :disabled="!isEditable || isLoading
                                    " v-model="document.quarterly_price"></v-text-field>

                                <label style="font-size: 12px;"> Annually Price </label>
                                <v-text-field dense placeholder="7200 USD" autocomplete="off" outlined :disabled="!isEditable || isLoading
                                    " v-model="document.annually_price"></v-text-field>

                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import {
    updateLab,
    unstakeLabFee
} from "@/lib/polkadotProvider/command/labs";
import { getOrdersData } from "@/lib/api";
import Kilt from "@kiltprotocol/sdk-js";
import CryptoJS from "crypto-js";
import { u8aToHex } from "@polkadot/util";
import serviceHandler from "@/lib/serviceHandler";
import { generalDebounce } from "@/utils";
import Dialog from "@/components/Dialog";
import Button from "@/components/Button";
import DialogErrorBalance from "@/components/Dialog/DialogErrorBalance";

export default {
    name: "MenstrualCalendarAdmin",
    mixins: [serviceHandler],

    components: { Dialog, Button, DialogErrorBalance },

    data: () => ({
        document: {
            monthly_price: "",
            quarterly_price: "",
            annually_price: ""
        },
        isEditable: false,
        isUploading: false,
        showActiveOrder: false,
        stakeStatus: "",
        unstakeAt: "",
        stakingAmount: "",
        unstakeDialog: false,
        unstakeLoading: false,
        unstakeFee: 0,
        verificationStatus: "",
        isVerify: false,
        isShowError: false,
        fee: 0
    }),

    computed: {
        ...mapGetters({
            api: "substrate/getAPI",
            pair: "substrate/wallet",
            labAccount: "substrate/labAccount"
        }),

        ...mapState({
            mnemonic: (state) => state.substrate.mnemonicData,
            web3: (state) => state.metamask.web3
        }),

        isRequired() {
            return [(val) => !!val || "This field is required"];
        },

        computeUnstakeDate() {
            let date = new Date(this.unstakeAt);
            date.setDate(date.getDate() + 6);
            return date.toLocaleDateString("en-US");
        },
    },

    watch: {
        mnemonic(val) {
            if (val) this.getKiltBoxPublicKey()
        },

        document: {
            deep: true,
            immediate: true,
            handler: generalDebounce(async function () {
                if (this.mnemonic) await this.getUpdateLabFee();
            }, 500)
        },
    },

    async created() {
        await this.getUnstakeFee();
    },

    methods: {
        async getLabInfo() {
            const {
                monthly_price,
                quarterly_price,
                annually_price
            } = this.labAccount.info;

            this.document = {
                monthly_price,
                quarterly_price,
                annually_price
            }
        },

        getKiltBoxPublicKey() {
            const cred = Kilt.Identity.buildFromMnemonic(
                this.mnemonic.toString(CryptoJS.enc.Utf8)
            );
            return u8aToHex(cred.boxKeyPair.publicKey);
        },

        async getUnstakeFee() {
            const fee = await unstakeLabFee(this.api, this.pair);

            this.unstakeFee = Number(
                this.web3.utils.fromWei(String(fee.partialFee), "ether")
            );
        },

        async handleShowUnstake() {
            const { data } = await getOrdersData(this.pair.address, null, null, null);
            const hasActiveOrder = data?.some(
                (order) => order._source.status === "Paid"
            );

            if (hasActiveOrder) this.showActiveOrder = true;
            else this.unstakeDialog = true;
        },

        async updateLab() {
            if (!this.$refs.form.validate()) {
                return;
            }
            try {
                this.isLoading = true;
                const boxPublicKey = this.getKiltBoxPublicKey();
                const {
                    monthly_price,
                    quarterly_price,
                    annually_price
                } = this.document;

                await updateLab(
                    this.api,
                    this.pair,
                    {
                        monthly_price,
                        quarterly_price,
                        annually_price

                    },
                    () => {
                        this.isLoading = false;
                        this.isEditable = false;
                    }
                );
            } catch (err) {
                console.error(err);
            }
        },

        closeDialog() {
            this.isShowError = false;
            this.isUploading = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.on-hover {
    cursor: pointer;
}

.support-url {
    text-decoration: none;
    color: gray;
}

.unstake-alert {
    font-size: 13px;
    padding-bottom: 12px;
    color: #363636;
}
</style>
