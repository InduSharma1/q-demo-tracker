<template>
    <div v-if="show_alert" class="slds-notify slds-notify_alert" role="alert">
        <span class="slds-assistive-text">info</span>
        <span class="slds-icon_container slds-icon-utility-user slds-m-right_x-small"
            title="Description of icon when needed">
            <svg class="slds-icon slds-icon_x-small" aria-hidden="true">
                <use xlink:href="/icons/utility-sprite/svg/symbols.svg#user"></use>
            </svg>
        </span>
        <h2> {{ message }} </h2>
        <div class="slds-notify__close">
            <button class="slds-button slds-button_icon slds-button_icon-small slds-button_icon-inverse" title="Close"
                @click="show_alert = false;">
                <svg class="slds-button__icon" aria-hidden="true">
                    <use xlink:href='/icons/utility-sprite/svg/symbols.svg#close'></use>
                </svg>
                <span class="slds-assistive-text">Close</span>
            </button>
        </div>
    </div>
</template>

<script>

import { defineComponent } from "vue";

export default defineComponent({
    name: "SLDSAlert",
    props: {
        /** message to show in the alert banner */
        message: String
    },
    data() {
        return {
            /** whether to show the alert banner or not */
            show_alert: true
        }
    }
})
</script>