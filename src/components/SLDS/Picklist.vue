<template>
    <div class="slds-form-element">
        <div class="slds-form-element__control">
            <div class="slds-combobox_container">
                <div class="slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click"
                    :class="{ 'slds-is-open': picklist_opened }">

                    <!-- picklist button -->
                    <div class="slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right" role="none">
                        <button type="button" class="slds-input_faux slds-combobox__input"
                            :class="{ 'slds-combobox__input-value': selected_value?.value }" @click="openClosePicklist"
                            @blur="handleBlur" aria-labelledby="combobox-label-id-26 combobox-id-1-selected-value"
                            id="combobox-id-1-selected-value" aria-controls="listbox-id-1" aria-expanded="false"
                            aria-haspopup="listbox">
                            <span v-if="!selected_value?.value" class="slds-truncate" id="combobox-value-id-28">{{
                                placeholder || 'Select an Option…' }}</span>
                            <span v-else class="slds-truncate" id="combobox-value-id-28">{{ selected_value?.label }}</span>
                        </button>
                        <span class="slds-icon_container slds-icon-utility-down slds-input__icon slds-input__icon_right">
                            <svg class="slds-icon slds-icon slds-icon_x-small slds-icon-text-default" aria-hidden="true">
                                <use xlink:href="/icons/utility-sprite/svg/symbols.svg#down"></use>
                                -->
                            </svg>
                        </span>
                    </div>

                    <!-- picklist dropdown -->
                    <div id="listbox-id-1" class="slds-dropdown slds-dropdown_length-5 slds-dropdown_fluid" role="listbox"
                        @mouseenter="picklist_in_focus = true;" @mouseleave="picklist_in_focus = false;">
                        <ul class="slds-listbox slds-listbox_vertical" role="presentation">
                            <li v-for="option in column?.picklistValues" :key="option.value" role="presentation"
                                class="slds-listbox__item">
                                <div id="option1"
                                    class="slds-media slds-listbox__option slds-listbox__option_plain slds-media_small"
                                    :class="{ 'slds-is-selected': selected_value?.value === option.value }" role="option"
                                    @click="selectMenu(option)">
                                    <span class="slds-media__figure slds-listbox__option-icon">
                                        <span v-if="selected_value?.value === option.value"
                                            class="slds-icon_container slds-icon-utility-check slds-current-color">
                                            <svg class="slds-icon slds-icon_x-small" aria-hidden="true">
                                                <use xlink:href="/icons/utility-sprite/svg/symbols.svg#check">
                                                </use>
                                            </svg>
                                        </span>
                                    </span>
                                    <span class="slds-media__body">
                                        <span class="slds-truncate" :title="option.label">{{ option.label }}</span>
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent } from "vue";

export default defineComponent({
    name: 'SLDSPicklist',
    data() {
        return {
            /** whether picklist dropdown is opened or not */
            picklist_opened: false,

            /** selected value for the picklist */
            selected_value: {},

            /** whether picklist dropdown is in focus */
            picklist_in_focus: false

        }
    },
    props: {
        /** contains the value selected */
        value: {},

        /** contains the metadata of the column */
        column: Object,

        /** placeholder for the picklist input */
        placeholder: String,

        /** refresh the picklist */
        refresh: Boolean,

        /** emit directly to the source or to the parent */
        emit_direct: {
            type: Boolean,
            default: false
        }
    },

    watch: {
        refresh(old_value, new_value) {
            new_value === true && this.refreshValue();
        }
    },

    methods: {

        /** open or close picklist dropdown */
        openClosePicklist() {
            this.picklist_opened = !this.picklist_opened;
        },

        /** close the picklist dropdown on blur or when any value is selected */
        handleBlur(event, manual = false) {
            if (this.picklist_in_focus && manual !== true) return;
            setTimeout(() => this.picklist_opened = false, 10);
        },

        /** select the value from the picklist dropdown */
        selectMenu(option) {
            this.selected_value = option;
            this.handleBlur(new FocusEvent('blur'), true);

            const event = {
                name: this.column?.name,
                value: this.selected_value.value
            }

            const event_name = 'on-change';
            !this.emit_direct ? this.$parent?.$emit(event_name, event) : this.$emit(event_name, event);
        },

        refreshValue() {
            this.selected_value = this.value || null;
        }
    },
    mounted() {
        setTimeout(() => this.refreshValue(), 100);
    },
})
</script>

<style scoped>
.slds-input_faux {
    padding-top: 0;
    padding-right: var(--slds-c-input-spacing-horizontal-end, var(--sds-c-input-spacing-horizontal-end, 1rem));
    padding-bottom: 0;
    padding-left: var(--slds-c-input-spacing-horizontal-start, var(--sds-c-input-spacing-horizontal-start, .75rem));
    width: 100%;
    line-height: 1.875rem;
    border: 1px solid var(--slds-c-input-color-border, var(--sds-c-input-color-border, #c9c9c9));
    border-radius: var(--slds-c-input-radius-border, var(--sds-c-input-radius-border, .25rem));
    background-color: var(--slds-c-input-color-background, var(--sds-c-input-color-background, #fff));
    color: var(--slds-c-input-text-color, var(--sds-c-input-text-color));
    -webkit-box-shadow: var(--slds-c-input-shadow, var(--sds-c-input-shadow));
    box-shadow: var(--slds-c-input-shadow, var(--sds-c-input-shadow));
    -webkit-transition: border .1s linear, background-color .1s linear;
    transition: border .1s linear, background-color .1s linear;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    text-align: left;
}

.slds-input_faux:not(.slds-combobox__input-value) {
    color: #747474;
}

.slds-input--height,
.slds-input_faux,
.slds-input_height {
    min-height: calc(1.875rem + 2px);
}

.slds-combobox__input.slds-has-focus,
.slds-combobox__input:focus {
    border-color: #1b96ff;
    -webkit-box-shadow: 0 0 3px #0176d3;
    box-shadow: 0 0 3px #0176d3;
}

.slds-listbox__option.slds-is-selected .slds-listbox__option-icon {
    color: #0176d3;
}

.slds-listbox__option-icon {
    width: 1.5rem;
}
</style>
