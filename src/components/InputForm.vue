<template>
    <div class="slds-form-element" :class="{ 'slds-has-error': err_msg !== '' }">
        <!-- Tooltip for helptext -->
        <Popover v-if="column?.helptext && show_helptext" :helptext="column.helptext" />

        <!-- Helptext Icon -->
        <button v-if="column?.helptext" class="slds-button slds-button_icon slds-button_icon-x-small" aria-haspopup="true"
            tabindex="-1" @mouseenter="show_helptext = true" @mouseleave="show_helptext = false">

            <svg class="action-btn slds-button__icon slds-button__icon_hint slds-button__icon_small error"
                aria-hidden="true">
                <use xlink:href="/icons/utility-sprite/svg/symbols.svg#info"></use>
            </svg>

            <span class="slds-assistive-text">Help Text</span>
        </button>

        <!-- column label and required sign -->
        <label class="slds-form-element__label" for="text-input-id-46">
            <abbr class="slds-required" title="required" v-if="column?.required">* </abbr>
            <span v-if="!column?.hideLabel">{{ column?.label }}</span>
        </label>

        <!-- call components for the columns as per their datatypes -->
        <div class="slds-form-element__control">
            <Picklist v-if="column?.type === 'picklist' || column?.type === 'combobox'" :column="column"
                :placeholder="column.placeholder" />
            <slds-input
                v-if="column?.type === 'text' || column?.type === 'string' || column?.type === 'int' || column?.type === 'number' || column?.type === 'password'"
                :column="column" />

            <check-box v-if="column?.type === 'boolean'" :name="column.name" :checked="true"
                :label="column?.label"></check-box>
        </div>
        <div v-if="err_msg" class="slds-form-element__help"> {{ err_msg }}</div>
    </div>
</template>

<script>

import { defineComponent } from "vue";
import Picklist from './SLDS/Picklist.vue';
import CheckBox from './SLDS/CheckBox.vue';
import Popover from './SLDS/Popover.vue';
import SldsInput from './SLDS/SLDSInput.vue';

export default defineComponent({
    name: 'InputForm',
    props: {
        /** contains the metadata of the field */
        column: {
            type: Object
        },
        /** error message to show on invalid input field */
        err_msg: {
            type: String,
            default: ''
        }
    },
    components: {
        Picklist,
        SldsInput,
        CheckBox,
        Popover
    },
    data() {
        return {
            /** to show helptext or not */
            show_helptext: false
        }
    }
})
</script>