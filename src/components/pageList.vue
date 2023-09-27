<template>
    <!-- spinner -->
    <Spinner v-if="loading"></Spinner>

    <!-- toasters -->
    <toast ref="toastCmp" :timer="5000" />

    <!-- Page Details -->
    <article class="slds-card slds-card_boundary">
        <div class="slds-card__header slds-grid">
            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                <div class="slds-media__figure">
                    <svg aria-hidden="true" class="slds-icon slds-icon_small slds-icon-text-default ">
                        <use xlink:href='/icons/utility-sprite/svg/symbols.svg#list'></use>
                    </svg>
                </div>
                <div class="slds-media__body slds-truncate">
                    <h2>
                        <a href="javascript:void(0);" class="slds-text-link_reset">
                            <span class="slds-text-heading_small">Tracker ({{ no_of_pages }})</span>
                        </a>
                    </h2>

                </div>
            </header>
            <div class="slds-no-flex">
                <SLDSButton label="New Tracker" type="brand" @button-clicked="newPageModal"></SLDSButton>
            </div>
        </div>
        <div class="slds-card__body slds-scrollable">
            <table
                class="slds-table slds-table_bordered slds-max-medium-table_stacked-horizontal slds-table_fixed-layout tool_table slds-text-align_center">
                <thead>
                    <tr class="slds-text-title_caps">
                        <th class="slds-cell-shrink" scope="col"></th>
                        <th scope="col" class="name_col">
                            <div class="slds-truncate" title="Name">Name</div>
                        </th>
                        <th scope="col" class="description_col">
                            <div class="slds-truncate" title="Description">Description</div>
                        </th>
                        <th scope="col" class="uniquecode_col">
                            <div class="slds-truncate" title="Unique code">Unique code</div>
                        </th>
                        <th scope="col" class="active_col">
                            <div class="slds-truncate" title="Is Active">Is Active ?</div>
                        </th>
                        <th class="edit_col slds-cell-shrink" scope="col">
                            <div class="slds-th__action">
                                <span class="slds-assistive-text">Edit</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody v-if="pages">
                    <tr v-for="page in pages" :key="page.id">
                        <td class="slds-cell-shrink" scope="col"></td>
                        <td data-label="Name">
                            <div class="slds-truncate">{{ page.page_name }}</div>
                        </td>
                        <td data-label="Description">
                            <div class="slds-text-body_small slds-text-color_weak">{{ page.description }}</div>
                        </td>
                        <td data-label="Unique Code" class="unique-code-cell">
                            <div class="slds-truncate slds-text-font_monospace">{{ page.id }}</div>
                            <SLDSButton v-if="page.is_active" class="copy-btn" type="brand" icon="copy" :button_icon="true"
                                title="Copy Unique code" @button-clicked="copyUniquecode(page.id)" />
                        </td>
                        <td data-label="Is Active?" role="gridcell">
                            <div class="slds-truncate slds-grid slds-grid_align-end">
                                <div class="slds-form-element">
                                    <label class="slds-checkbox_toggle slds-grid">
                                        <input type="checkbox" name="checkbox" aria-describedby="toggle-desc"
                                            :value="page.id" :checked="page.is_active" @change="togglePage($event)" />

                                        <span id="toggle-desc" class="slds-checkbox_faux_container" aria-live="assertive">
                                            <span class="slds-checkbox_faux"></span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </td>
                        <td data-label="Edit" role="gridcell">
                            <div class="slds-truncate slds-grid slds-grid_align-end">
                                <button v-if="edit_enabled" class="slds-button slds-button_icon" aria-haspopup="true"
                                    title="Edit" @click="edit(page)">
                                    <svg aria-hidden="true" class="slds-button__icon slds-button__icon_medium">
                                        <use xlink:href="/icons/utility-sprite/svg/symbols.svg#edit"></use>
                                    </svg>
                                    <span class="slds-assistive-text">Edit</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="no_data === true" class="slds-text-align_center slds-m-top_medium">Looks like there's no tracker at
                the
                moment.
            </div>
        </div>
        <footer class="slds-card__footer">
            <a class="slds-card__footer-action" href="javascript:void(0);" @click="newPageModal">Add a New Tracker
                <span class="slds-assistive-text">New Tracker</span>
            </a>
        </footer>
    </article>
    <!-- Add New Page Modal -->
    <modal v-if="open_page_modal" @click-close="closePageModal" @click-save="addEditPage" :save_button_label=submit_type
        size="x-small">
        <template #header>
            <h1 class="slds-text-heading_medium slds-hyphenate heading">
                {{ submit_type == 'Update' ? 'Update Tracker' : 'Add a New Tracker' }} </h1>
        </template>

        <template #body>
            <div class="slds-modal__content slds-p-around_medium">
                <input-form :column="page_name_field" @on-change="inputChange" :err_msg="err_msg" />
                <input-form :column="page_description_field" @on-change="inputChange" />
            </div>
        </template>
    </modal>
</template>

<script>
import { defineComponent } from "vue";
import SLDSButton from "./SLDS/Button.vue";
import Modal from "./SLDS/Modal.vue";
import InputForm from "./InputForm.vue";
import Toast from "./SLDS/Toast.vue";
import Spinner from "./SLDS/Spinner.vue";
// api services
import DataService from '../services/data';

export default defineComponent({

    name: "PageList",

    props: {
        org_default: {
            type: Object,
        }
    },

    components: {
        SLDSButton,
        Modal,
        InputForm,
        Toast,
        Spinner
    },

    mounted() {
        if (this.org_default.value) {
            this.fetchDataFromServer(this.org_default.value);
        }
        this.makeColumns();
    },

    watch: {
        '$store.state.sharedData': {
            immediate: true,
            handler(newData) {
                if (newData) {
                    // Whenever the shared data changes, fetch data from the server
                    this.fetchDataFromServer(newData);
                }
            },
        },
    },

    data() {
        return {
            /** to show the spinner when data is loaded */
            loading: false,
            /**Selected Org key */
            org_key: '',
            /** open the add new user confirmation modal */
            open_page_modal: false,
            /** Page Name field */
            page_name_field: {},
            /** Page Description field */
            page_description_field: {},
            /** form data - from the modal */
            form_data: {},
            /** error message to show on invalid input field */
            err_msg: '',
            /** List of pages */
            pages: [],
            /** If there is no page */
            no_data: true,
            /** Enable flag for edit button */
            edit_enabled: true,
            /** Submit Button type - Add ,Edit */
            submit_type: 'Add',
            /**No of pages per Org */
            no_of_pages: 0
        }
    },
    methods: {
        // Simulate an asynchronous page detail fetch from the server based on Org Key
        async fetchDataFromServer(data) {
            try {
                this.loading = true;
                this.org_key = data;
                const result = await DataService.getPageData(data);
                this.pages = result.data.pages;
                if (this.pages.length > 0) {
                    this.no_data = false;
                    this.no_of_pages = this.pages.length;
                } else {
                    this.no_data = true;
                    this.no_of_pages = 0;
                }
                this.loading = false;
            } catch (error) {
                console.log("Pagelist cmp - fetchDataFromServer - error in fetch page details -", error);
                this.showToasts('error', error.response?.data?.error || 'Some error occured while fetching the data. Please try again!');
                if (error.response.data.expired) return;
                this.loading = false;
            }
        },

        /** show toast messages */
        showToasts(type, message) {
            (this.$refs.toastCmp).addToast({
                type, message
            })
        },

        /** make columns for the page details */
        makeColumns() {
            this.page_name_field = {
                name: 'page_name',
                type: 'string',
                label: 'Name',
                placeholder: 'Name of the tracker',
                picklistValues: [],
                required: true,
                //helptext: 'Password length must be between 5 - 50 characters.'
            };
            this.page_description_field = {
                name: 'description',
                type: 'string',
                label: 'Description',
                placeholder: 'This will help you identify the tracker. Stay concise. Be meaningful.',
                picklistValues: [],
                required: false,
                //helptext: 'Password length must be between 5 - 50 characters.'
            };
        },
        /** open the Add Page modal */
        newPageModal() {
            this.submit_type = 'Add';
            this.open_page_modal = true;
            this.form_data = {
                // id: crypto.randomUUID(),
                page_name: '',
                description: '',
                is_active: false,
                org_key: ''
            };
            this.page_name_field.value = '';
            this.page_description_field.value = '';
        },
        /** open the Edit Page modal */
        edit(page) {
            this.submit_type = 'Update';
            this.open_page_modal = true;
            this.form_data = page;
            this.page_name_field.value = this.form_data.page_name;
            this.page_description_field.value = this.form_data.description;
        },
        /** called when an input field is changed inside the modal */
        inputChange(event) {
            this.form_data[event.name] = event.value;
        },
        /** add/ Edit a Page */
        async addEditPage() {
            try {
                this.loading = true;
                if (!this.form_data.page_name) {
                    this.err_msg = 'Please enter a Name.';
                    return this.err_msg;
                }
                if (this.submit_type == 'Add') {
                    this.form_data.org_key = this.org_key;
                    this.form_data.is_active = true;
                    this.open_page_modal = false;
                    //Sending data to DB
                    const page_id = await this.PushingDataToServer(this.form_data);
                    //this.fetchDataFromServer(this.org_key);
                    this.form_data.id = page_id;
                    this.pages.push({
                        id: page_id,
                        page_name: this.form_data.page_name,
                        description: this.form_data.description,
                        is_active: this.form_data.is_active,
                        org_key: this.form_data.org_key
                    });
                    this.no_of_pages = this.no_of_pages + 1;
                }
                else {
                    //Update
                    this.open_page_modal = false;
                    //Sending data to DB
                    this.PushingDataToServer(this.form_data);
                }
                this.no_data = false;
                this.loading = false;
            } catch (error) {
                console.log("Pagelist cmp - fetchDataFromServer - error in add page -", error);
                this.loading = false;
            }
        },
        /** close the reset modal */
        closePageModal() {
            this.open_page_modal = false;
            this.err_msg = '';
            this.form_data = {
                // id: crypto.randomUUID(),
                page_name: '',
                description: '',
                is_active: false,
                org_key: ''
            };
            this.page_name_field.value = '';
            this.page_description_field.value = '';
        },
        /** when the checkbox is clicked */
        togglePage(event) {
            this.submit_type = 'Update';
            let selected_page = this.pages.find(page => page.id === (event.target).value);
            if (selected_page) {
                selected_page.is_active = !selected_page.is_active;
                //Update in DB
                this.PushingDataToServer(selected_page);
            }
        },
        async PushingDataToServer(data) {
            try {
                this.loading = true;
                let result;
                if (this.submit_type == 'Add') {
                    result = await DataService.createPageData(data);
                }
                else {
                    result = await DataService.updatePageData(data);
                }
                this.loading = false;
                return result.data.page_id;
            } catch (error) {
                console.log("Pagelist cmp - PushingDataToServer - error in Pushing data to Org -", error);
                this.showToasts('error', error.response?.data?.error || 'Some error occured while creating the data. Please try again!');
                if (error.response.data.expired) return;
                this.loading = false;
            }
        },
        /** copy Unique code to clipboard */
        copyUniquecode(text) {
            navigator.clipboard.writeText(text);
            this.showToasts('info', 'Unique code copied to the clipboard!');
        },
    },
});
</script>

<style scoped>
.tool_table {
    max-width: 100%;
}

.tool_table th,
td {
    max-width: 100%;
}

.tool_table th.name_col {
    width: 20%;
}

.tool_table th.description_col {
    width: 25%;
}

.tool_table th.uniquecode_col {
    width: 45%;
}

.tool_table th.active_col {
    width: 6%;
}

.tool_table th.edit_col {
    width: 4%;
}

.tool_table td[data-label="Edit"] div {
    padding-right: 20px;
}

.unique-code-cell {
    display: flex;
    align-items: center;
    gap: 8px;
}
</style>
