<template>
    <!-- spinner -->
    <spinner v-if="loading"></spinner>

    <!-- toasters -->
    <toast ref="toastCmp" :timer="5000" />

    <!-- Page Body goes here -->
    <div>
        <!-- Dropdown for Org list-->
        <div class="slds-container_center slds-container_small slds-m-top_medium slds-m-bottom_medium">
            <orgTypeSelect :org_default="org_Default" @on-select="orgSelected"></orgTypeSelect>
        </div>
        <div>
            <pageList :org_default="org_Default"></pageList>
        </div>
    </div>
</template>

<script>

import { defineComponent } from "vue";
import orgTypeSelect from "./orgTypeSelect.vue";
import pageList from "./pageList.vue";

// SLDS Components
import Spinner from "./SLDS/Spinner.vue";
import Toast from "./SLDS/Toast.vue";

export default defineComponent({

    name: "PageBody",

    components: {
        Spinner,
        Toast,
        orgTypeSelect,
        pageList,
    },

    data() {
        return {
            /** to show the spinner when data is loaded */
            loading: false,

            /*** default org value */
            org_Default: {
                active: true,
                validFor: null,
                value: 'aa74d1a8-5884-1c5f-082f-8bfbee691add',
                label: 'The Simple Demo Org (SDO)'
            },  //Simple Demo Org 
        }
    },

    methods: {
        /** show toast messages */
        showToasts(type, message) {
            (this.$refs.toastCmp).addToast({
                type, message
            })
        },
        /** called when a org is selected from the dropdown */
        orgSelected(event) {
            this.$store.commit('setSharedData', event.value);
        },

    },
});
</script >

<style scoped></style>
