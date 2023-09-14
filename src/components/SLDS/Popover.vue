<template>
    <section aria-describedby="dialog-body-id-98" aria-label="Dialog Title"
        class="slds-popover slds-popover_tooltip slds-nubbin_bottom-left" role="tooltip">
        <div class="slds-popover__body" id="dialog-body-id-98">
            <p class="slds-cell-wrap">{{ helptext }}</p>
        </div>
    </section>
</template>

<script>

import { defineComponent } from "vue";

export default defineComponent({
    name: 'SLDSPopover',
    props: {
        /** helptext to show for the fields */
        helptext: String
    }
})
</script>

<style scoped>
.slds-popover {
    position: absolute;
    left: -14px;
    min-width: 12rem;
    width: fit-content;
    bottom: 65px;
}
</style>