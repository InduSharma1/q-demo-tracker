<template>
    <div class="slds-form-element">
        <div class="slds-form-element__control">
            <div class="slds-combobox-group">

                <!-- multi lookup -->
                <div class="slds-combobox_container slds-combobox-addon_end">
                    <div class="slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click"
                        :class="{ 'slds-is-open': search_opened }" id="primary-combobox-id-1">

                        <!-- input to search records -->
                        <div class="slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right" role="none">
                            <input type="text" class="slds-input slds-combobox__input slds-truncate" id="combobox-id-1"
                                aria-autocomplete="list" aria-controls="listbox-id-1" aria-expanded="false"
                                aria-haspopup="listbox" autoComplete="off" role="combobox"
                                placeholder="Search for Demo User..." :title="searched_value" v-model="searched_value"
                                @keyup="onKeyUp" @blur="handleBlur" @click="openSearchList" />

                            <!-- spinner when records are being searched -->
                            <div v-if="loading" class="slds-input__icon-group slds-input__icon-group_right">
                                <div role="status"
                                    class="slds-spinner slds-spinner_brand slds-spinner_x-small slds-input__spinner">
                                    <span class="slds-assistive-text">Loading</span>
                                    <div class="slds-spinner__dot-a"></div>
                                    <div class="slds-spinner__dot-b"></div>
                                </div>
                            </div>

                            <!-- search icon (visible when no record is selected) -->
                            <span v-if="!display_value"
                                class="slds-icon_container slds-icon-utility-search slds-input__icon slds-input__icon_right"
                                title="Search">
                                <svg class="slds-icon slds-icon slds-icon_x-small slds-icon-text-default"
                                    aria-hidden="true">
                                    <use xlink:href="/icons/utility-sprite/svg/symbols.svg#search"></use>
                                </svg>
                                <span class="slds-assistive-text">Search</span>
                            </span>

                            <!-- clear icon (when a record is selected) -->
                            <span v-else
                                class="slds-icon_container slds-icon-utility-search slds-input__icon slds-input__icon_right"
                                title="Clear" @click="clearValue">
                                <svg class="slds-icon slds-icon slds-icon_x-small slds-icon-text-default"
                                    aria-hidden="true">
                                    <use xlink:href="/icons/utility-sprite/svg/symbols.svg#close"></use>
                                </svg>
                                <span class="slds-assistive-text">Clear</span>
                            </span>
                        </div>

                        <!-- no results found message -->
                        <div v-if="no_results" class="no-results">
                            No Results Found.
                        </div>

                        <!-- records list -->
                        <div id="listbox-id-1" class="slds-dropdown slds-dropdown_length-with-icon-7 slds-dropdown_fluid"
                            role="listbox" @mouseenter="picklist_in_focus = true;" @mouseleave="picklist_in_focus = false;"
                            v-if="search_list.length > 0">
                            <ul class="slds-listbox slds-listbox_vertical" role="presentation">
                                <li v-for="option in search_list" :key="option.Id" role="presentation"
                                    class="slds-listbox__item">
                                    <div id="option1"
                                        class="slds-media slds-listbox__option slds-listbox__option_entity slds-listbox__option_has-meta"
                                        role="option" @click="selectValue(option)">
                                        <span class="slds-media__body">
                                            <span class="slds-listbox__option-text slds-listbox__option-text_entity">{{
                                                option.Name }}</span>
                                        </span>

                                        <!-- user already added in the list -->
                                        <button v-if="option.added"
                                            class="slds-button slds-button_icon slds-button_icon-border slds-button_icon-small"
                                            title="In the list">
                                            <svg class="slds-button__icon" aria-hidden="true">
                                                <use xlink:href="/icons/utility-sprite/svg/symbols.svg#check">
                                                </use>
                                            </svg>
                                            <span class="slds-assistive-text">In the list</span>
                                        </button>

                                        <!-- add user to the list -->
                                        <button v-else
                                            class="slds-button slds-button_icon slds-button_icon-border slds-button_icon-small"
                                            title="Add">
                                            <svg class="slds-button__icon" aria-hidden="true">
                                                <use xlink:href="/icons/utility-sprite/svg/symbols.svg#adduser">
                                                </use>
                                            </svg>
                                            <span class="slds-assistive-text">Add</span>
                                        </button>

                                    </div>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent } from "vue";
import DataService from "./../../services/data";

export default defineComponent({
    name: 'MultiLookup',
    props: {
        /** contains the value selected */
        value: Object,

        /** contains the metadata of the column */
        column: Object,

        /** refresh the lookup */
        refresh: Boolean
    },
    data() {
        return {

            /** search dropdown is opened/closed */
            search_opened: false,

            /** selected record from the searched list */
            selected_value: {},

            /** value to be displayed (mostly name) in the input for the record selected */
            display_value: '',

            /** value searched */
            searched_value: '',

            /** records returned as per the searched term */
            search_list: [],

            /** timer used for debounce */
            timer: 0,

            /** to show no results found message */
            no_results: false,

            /** to show spinner when records are loading */
            loading: false,

            /** if picklist dropdown is in focus */
            picklist_in_focus: false
        }
    },

    watch: {
        refresh(old_value, new_value) {
            new_value === true && this.clearValue(new MouseEvent('click'), false);
        }
    },

    methods: {

        /** close the picklist dropdown on blur or when a value is selected */
        handleBlur(event, manual = false) {
            if (this.picklist_in_focus && manual !== true) return;
            setTimeout(() => this.search_opened = false, 10);
        },

        /** add debounce for search when a user types any value */
        onKeyUp() {
            this.no_results = false;
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => this.search(), 500);
        },

        /** search for related records as per the searched term */
        async search() {
            try {
                if (!this.searched_value) return this.clearValue(new MouseEvent('click'));

                this.loading = true;

                const results = await DataService.getSearchResults(this.searched_value);
                this.search_list = results.data;

                this.search_list = [];

                this.loading = false;

                if (this.search_list.length === 0) return this.no_results = true;
                this.search_opened = true;

            } catch (error) {
                console.log("error in search ----", error);
                this.loading = false;
                this.search_opened = false;
                this.no_results = true;
                this.search_list = [];
                if (error.response.data.expired) return;
                this.loading = false;
            }
        },

        /** select a value from the searched list */
        selectValue(option) {
            this.selected_value = option;
            this.display_value = `${option.Name}`;
            this.searched_value = this.display_value;
            this.search_list = [];
            this.handleBlur(new FocusEvent('blur'), true);
            this.$emit('on-change', {
                name: this.column?.name,
                value: this.selected_value
            })
        },

        /** open/close the search list dropdown */
        openSearchList() {
            if (this.search_list.length > 0) this.search_opened = true;
        },

        /** clear the selected value from the input */
        clearValue(event, emit_event = true) {
            this.search_list = [];
            this.selected_value = {};
            this.display_value = '';
            this.searched_value = '';
            this.search_opened = false;
            this.no_results = false;

            emit_event && this.$emit('on-change', {
                name: this.column?.name,
                value: null
            })
        }
    }
})
</script>

<style scoped>
.slds-combobox__input.slds-has-focus,
.slds-combobox__input:focus {
    border-color: #1b96ff;
    -webkit-box-shadow: 0 0 3px #0176d3;
    box-shadow: 0 0 3px #0176d3;
}

.slds-listbox__option.slds-is-selected .slds-listbox__option-icon {
    color: #0176d3;
}

.slds-input-has-icon .slds-input__icon:not(button) {
    pointer-events: auto;
    cursor: pointer;
}

.no-results {
    padding: 0.25rem 1rem 0 0.75rem;
    color: red;
}

.slds-media.slds-listbox__option.slds-listbox__option_entity.slds-listbox__option_has-meta {
    align-items: center;
}

.slds-listbox_vertical .slds-listbox__option_has-meta .slds-media__figure {
    margin-top: 0;
}

input[disabled].slds-combobox__input+.slds-icon_container {
    pointer-events: none;
    cursor: no-drop;
}

.slds-input {
    width: 200px;
}
</style>