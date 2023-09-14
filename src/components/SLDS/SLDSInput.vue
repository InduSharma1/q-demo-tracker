<template>
    <div>
        <!-- text input -->
        <input v-if="column?.type === 'string' || column?.type === 'text'" type="text" :required="column?.required"
            :placeholder="column?.placeholder" class="slds-input" @keyup="onKeyUp" :readonly="column?.readonly"
            :value="column?.value" />

        <!-- number input -->
        <input v-if="column?.type === 'int' || column?.type === 'number'" type="number" :required="column?.required"
            :placeholder="column?.placeholder" class="slds-input" @keyup="onKeyUp" :readonly="column?.readonly"
            :value="column?.value" />

        <!-- password input -->
        <input v-if="column?.type === 'password'" type="password" :required="column?.required" class="slds-input"
            :placeholder="column?.placeholder" @keyup="onKeyUp" :readonly="column?.readonly" :value="column?.value" />

    </div>
</template>

<script>

import { defineComponent } from "vue";

export default defineComponent({
    name: 'SLDSInput',
    props: {
        /** contains the metadata of the column */
        column: Object,
    },
    data() {
        return {
            /** timer for debounce */
            timer: 0
        }
    },
    methods: {

        /** fired on key up */
        onKeyUp(event) {
            const value = (event.target).value;
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => this.onChange(value), 500);
        },

        /** emit event to the parent when any value is changed - after debounce */
        onChange(value) {
            this.$parent?.$emit('on-change', {
                name: this.column?.name,
                value
            })
        },
    }
})
</script>

<style scoped></style>