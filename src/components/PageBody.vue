<template>
    <!-- toasters -->
    <toast ref="toastCmp" :timer="5000" />

    <!-- Page Body goes here -->
    <div>
        <!-- Dropdown for Org list-->
        <div class="slds-container_center slds-container_small slds-m-top_medium slds-m-bottom_medium">
            <OrgTypeSelect :org_default="org_default" @onSelect="orgSelected"></OrgTypeSelect>
        </div>
        <div>
            <PageList :org_default="org_default"></PageList>
        </div>
    </div>
</template>

<script>

import { defineComponent } from "vue";
// SLDS Components
import Toast from "./SLDS/Toast.vue";
import OrgTypeSelect from "./OrgTypeSelect.vue";
import PageList from "./PageList.vue";

export default defineComponent({

    name: "PageBody",

    components: {
        Toast,
        OrgTypeSelect,
        PageList,
    },

    data() {
        return {
            /*** default org value */
            org_default: {
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
