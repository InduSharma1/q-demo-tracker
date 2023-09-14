<template>
    <div class="slds-form-element">
        <div class="slds-form-element__control">
            <div class="slds-checkbox">
                <input type="checkbox" :name="name" :id="name" :value="name" :checked="checked" @change="change($event)" />
                <label class="slds-checkbox__label" :for="name">
                    <span class="slds-checkbox_faux"></span>
                    <span v-if="label" class="slds-form-element__label">{{ label }}</span>
                </label>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent } from "vue";

export default defineComponent({
    name: "CheckBox",
    props: {

        /** label for the checkbox */
        label: {
            type: String,
            default: ''
        },

        /** whether the checkbox is checked by default */
        checked: {
            type: Boolean,
            default: false
        },

        /** unique name for the checkbox */
        name: {
            type: String,
            default: ''
        }

    },
    methods: {

        /** when the checkbox is clicked */
        change(event) {
            const value = (event.target)?.checked;
            this.emitValue(value);
        },

        /** emit event to parent when the checkbox is clicked */
        emitValue(value) {
            this.$parent?.$emit('on-change', { value: value || false, name: this.name });
        }
    },
    mounted() {
        this.emitValue(this.checked);
    }
})

</script>

<style scoped>
.slds-form-element {
    float: left;
    position: absolute;
    cursor: pointer;
}
</style>  