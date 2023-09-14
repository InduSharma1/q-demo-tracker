<template>
    <div>
        <section role="dialog" tabindex="-1" aria-labelledby="modal-heading-01" aria-modal="true"
            aria-describedby="modal-content-id-1" class="slds-modal slds-fade-in-open slds-modal_small">
            <div class="slds-modal__container">

                <!-- header -->
                <header class="slds-modal__header">
                    <button class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse" title="Close"
                        @click="onClickCancel">
                        <svg class="slds-button__icon slds-button__icon_large" aria-hidden="true">
                            <use xlink:href="/icons/utility-sprite/svg/symbols.svg#close"></use>
                        </svg>
                        <span class="slds-assistive-text">Close</span>
                    </button>
                    <slot name="header"></slot>
                </header>

                <!-- body -->
                <div class="slds-modal__content slds-p-around_medium" id="modal-content-id-1">
                    <slot name="body"></slot>
                </div>

                <!-- footer -->
                <footer class="slds-modal__footer">
                    <button v-if="cancel_button_label != 'null'" class="slds-button slds-button_neutral"
                        @click="onClickCancel">
                        {{ cancel_button_label }}
                    </button>
                    <button v-if="save_button_label != 'null'" class="slds-button slds-button_brand" @click="onClickSave"
                        :disabled="save_button_disable">
                        {{ save_button_label }}
                    </button>
                </footer>

            </div>
        </section>
        <div class="slds-backdrop slds-backdrop_open"></div>
    </div>
</template>

<script>

import { defineComponent } from "vue";

export default defineComponent({
    name: "SLDSModal",
    props: {
        /** label on the cancel button (secondary button) */
        cancel_button_label: {
            default: 'Cancel',
            type: String
        },

        /** label on the save button (primary button) */
        save_button_label: {
            default: 'Save',
            type: String
        },

        /** disable the save (primary) button */
        save_button_disable: {
            default: false,
            type: Boolean
        }
    },
    methods: {
        /** emit event to parent when secondary button is clicked */
        onClickCancel() {
            this.$emit('click-close');
        },

        /** emit event to parent when primary button is clicked */
        onClickSave() {
            this.$emit('click-save');
        }
    }
})
</script>

<style scoped>
.slds-modal__content {
    overflow: initial;
    text-align: left;
}
</style>