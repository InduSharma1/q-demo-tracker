<template>
    <div class="demo-only demo-only_viewport demo--inverse">
        <div class="slds-spinner_container slds-is-fixed">
            <div role="status" class="slds-spinner slds-spinner_medium">
                <span class="slds-assistive-text">Loading</span>
                <div class="slds-spinner__dot-a"></div>
                <div class="slds-spinner__dot-b"></div>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent } from "vue";

export default defineComponent({
    name: "SLDSSpinner"
})
</script>