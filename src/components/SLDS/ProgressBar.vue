<template>
    <div>
        <div class="slds-grid slds-grid_align-spread slds-p-bottom_x-small" id="progress-bar-label-id-5">
            <span>{{ label }}</span>
            <span aria-hidden="true">
                <strong>{{ progress }}% Complete</strong>
            </span>
        </div>
        <div class="slds-progress-bar" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="progress"
            aria-labelledby="progress-bar-label-id-5" :aria-label="label" role="progressbar">
            <span class="slds-progress-bar__value" :class="success_class" :style="{ 'width': progress + '%' }">
                <span class="slds-assistive-text">Progress: {{ progress }}%</span>
            </span>
        </div>
    </div>
</template>

<script>

import { defineComponent } from "vue";

export default defineComponent({
    name: 'SLDSProgressBar',
    props: {
        /** label of the progress bar */
        label: String,

        /** progress of the progress bar */
        progress: Number
    },
    data() {
        return {
            /** class to add when the progress is 100% */
            success_class: ''
        }
    },
    updated() {
        this.success_class = this.progress === 100 ? 'slds-progress-bar__value_success' : ''
    }
})
</script>

<style scoped></style>