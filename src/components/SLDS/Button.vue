<template>
    <button v-if="!button_icon" class="slds-button" @click="click" :disabled="disable" :class="{
        'slds-button_neutral': type === 'neutral',
        'slds-button_brand': type === 'brand',
        'slds-button_outline-brand': type === 'outline-brand',
        'slds-button_destructive': type === 'destructive',
        'slds-button_text-destructive': type === 'text-destructive',
        'slds-button_success': type === 'success'
    }">
        <svg v-if="icon" class="slds-button__icon slds-button__icon_left" aria-hidden="true">
            <use :xlink:href="icon_path"></use>
        </svg>
        {{ label }}
    </button>

    <button v-else class="slds-button slds-button_icon" :title="title" :disabled="disable" @click="click">
        <svg class="slds-button__icon" aria-hidden="true">
            <use :xlink:href="icon_path"></use>
        </svg>
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
        icon: String,

        /** to disable the button */
        disable: Boolean,

        /** title of the button */
        title: String,

        /** whether the button is a button icon */
        button_icon: Boolean
    },
    data() {
        return {
            /** dynamic path for the icon */
            icon_path: ''
        }
    },
    methods: {
        /** emit event to parent when the button is clicked */
        click() {
            this.$emit('button-clicked');
        }
    },
    created() {
        this.icon_path = `/icons/utility-sprite/svg/symbols.svg#${this.icon}`;
    }
})
</script>

<style scoped>
.slds-button_icon .slds-button__icon {
    width: 1.2rem;
    height: 1.2rem;
}
</style>