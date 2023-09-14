<template>
    <button class="slds-button" @click="click" :disabled="disable" :class="{
        'slds-button_neutral': type === 'neutral',
        'slds-button_brand': type === 'brand',
        'slds-button_outline-brand': type === 'outline-brand',
        'slds-button_destructive': type === 'destructive',
        'slds-button_text-destructive': type === 'text-destructive',
        'slds-button_success': type === 'success'
    }">
        <svg v-if="icon" class="slds-button__icon slds-button__icon_left" aria-hidden="true">
            <use xlink:href="/icons/utility-sprite/svg/symbols.svg#reset_password"></use>
        </svg>
        {{ label }}
    </button>
</template>

<script>

import { defineComponent } from "vue";

export default defineComponent({
    name: "SLDSButton",
    props: {

        /** label for the button */
        label: String,

        /** type of the button - brand, nuetral, success, destructive etc */
        type: {
            type: String,
            default: ''
        },

        /** to show icon with the button */
        icon: {
            type: Boolean,
            default: false
        },

        /** to disable the button */
        disable: Boolean
    },
    methods: {
        /** emit event to parent when the button is clicked */
        click() {
            this.$emit('button-clicked');
        }
    }
})
</script>