<template>
    <!-- spinner -->
    <spinner v-if="loading"></spinner>

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
                            <span class="slds-text-heading_small">Page List</span>
                        </a>
                    </h2>

                </div>
            </header>
            <div class="slds-no-flex">
                <SLDSButton label="New Page" type="brand" :icon="false" @button-clicked="newPageModal"></SLDSButton>
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
                        <th scope="col">
                            <div class="slds-truncate" title="Unique code">Unique code</div>
                        </th>
                        <th scope="col" class="active_col">
                            <div class="slds-truncate" title="Is Active">Is Active ?</div>
                        </th>
                        <th class="slds-cell-shrink" scope="col">
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
                        <td data-label="Unique Code">
                            <div class="slds-truncate slds-text-font_monospace">{{ page.id }}</div>
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
                        <td data-label="Active" role="gridcell">
                            <div class="slds-truncate slds-grid slds-grid_align-end">
                                <button v-if="editEnabled"
                                    class="slds-button slds-button_icon-border-filled slds-button_icon-small"
                                    aria-haspopup="true" @click="edit(page)">
                                    <svg aria-hidden="true" class="slds-button__icon">
                                        <use xlink:href="/icons/utility-sprite/svg/symbols.svg#edit"></use>
                                    </svg>
                                    <span class="slds-assistive-text">Edit</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="noData === true" class="slds-text-align_center slds-m-top_medium">Looks like there's no page at the
                moment.
            </div>
        </div>
        <footer class="slds-card__footer">
            <a class="slds-card__footer-action" href="javascript:void(0);" @click="newPageModal">Add a New Page
                <span class="slds-assistive-text">New Page</span>
            </a>
        </footer>
    </article>
    <!-- Add New Page Modal -->
    <modal v-if="open_Page_modal" @click-close="closePageModal" @click-save="addEditPage" :save_button_label=submit_type
        size="x-small">
        <template #header>
            <h1 class="slds-text-heading_medium slds-hyphenate heading">
                {{ submit_type == 'Update' ? 'Update Page' : 'Add a New Page' }} </h1>
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
// api services
import DataService from './../services/data';

export default defineComponent({

    name: "pageList",

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
    },

    created() {
        if (this.org_default) {
            this.fetchDataFromServer(this.org_default.value);
        }
        this.makeColumns();
    },

    watch: {
        '$store.state.sharedData': {
            immediate: true,
            handler(newData) {
                // Whenever the shared data changes, fetch data from the server
                this.fetchDataFromServer(newData);
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
            open_Page_modal: false,
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
            noData: true,
            /** Enable flag for edit button */
            editEnabled: true,
            /** Submit Button type - Add ,Edit */
            submit_type: 'Add',
        }
    },
    methods: {
        // Simulate an asynchronous page detail fetch from the server based on Org Key
        async fetchDataFromServer(data) {
            try {
                this.loading = true;
                this.org_key = data;
                console.log('Org key for getting details ', this.org_key);
                const result = await DataService.getPageData(data);
                this.pages = result.data.pagesDetails;
                if (this.pages.length > 0) {
                    this.noData = false;
                } else {
                    this.noData = true;
                }
                this.loading = false;
            } catch (error) {
                console.log("PageList - fetchDataFromServer - error in fetch Org----", error);
                this.showToasts('error', error.response?.data?.error || 'Some error occured while fetching the data. Please try again!');
                if (error.response.data.expired) return;
                this.loading = false;
                this.track('Client Error', error, 'fetch Pages');
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
            console.log('Pages inside pageList ', this.pages);
            this.page_name_field = {
                name: 'page_name',
                type: 'string',
                label: 'Name',
                placeholder: 'Name of the page that you want to track',
                picklistValues: [],
                required: true,
                //helptext: 'Password length must be between 5 - 50 characters.'
            };
            this.page_description_field = {
                name: 'description',
                type: 'string',
                label: 'Description',
                placeholder: 'This will help you identify the page. Stay concise. Be meaningful.',
                picklistValues: [],
                required: false,
                //helptext: 'Password length must be between 5 - 50 characters.'
            };
        },
        /** open the Add Page modal */
        newPageModal() {
            this.submit_type = 'Add';
            this.open_Page_modal = true;
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
            this.open_Page_modal = true;
            this.form_data = page;
            this.page_name_field.value = this.form_data.page_name;
            this.page_description_field.value = this.form_data.description;
        },
        /** called when an input field is changed inside the modal */
        inputChange(event) {
            this.form_data[event.name] = event.value;
            console.log('form data', this.form_data);
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
                    //mixpanel tracking for adding new page
                    DataService.trackMixpanel({ action: 'Add New Page' });
                    this.form_data.org_key = this.org_key;
                    this.form_data.is_active = true;
                    this.open_Page_modal = false;
                    //Sending data to DB
                    const pageId = await this.PushingDataToServer(this.form_data);
                    //this.fetchDataFromServer(this.org_key);
                    this.form_data.id = pageId;
                    this.pages.push({
                        id: pageId,
                        page_name: this.form_data.page_name,
                        description: this.form_data.description,
                        is_active: this.form_data.is_active,
                        org_key: this.form_data.org_key
                    });
                }
                else {
                    //Update
                    this.open_Page_modal = false;
                    //Sending data to DB
                    this.PushingDataToServer(this.form_data);
                }
                console.log('last form data', this.pages);
                this.noData = false;
                this.loading = false;
            } catch (error) {
                console.log("error in add page ----", error);
                this.loading = false;
                this.track('Client Error', error, 'Add/Edit Button');
            }
        },
        /** close the reset modal */
        closePageModal() {
            this.open_Page_modal = false;
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
            let selectedPage = this.pages.find(page => page.id === (event.target).value);
            if (selectedPage) {
                selectedPage.is_active = !selectedPage.is_active;
                console.log('Toggle value ', JSON.stringify(this.pages));
                //Update in DB
                this.PushingDataToServer(selectedPage);
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
                console.log('result ', result);
                this.loading = false;
                return result.data.pageid;
            } catch (error) {
                console.log("error in Pushing data to Org----", error);
                this.showToasts('error', error.response?.data?.error || 'Some error occured while creating the data. Please try again!');
                if (error.response.data.expired) return;
                this.loading = false;
                this.track('Client Error', error, 'Upsert Page');
            }
        },
        /**
         * track the actions to mixpanel
         * @param action action taken
         * @param error error message, if any
         * @param error_method method name which failed
         */
        track(action, error = '', error_method = '') {

            const props = {
                action
            }
            if (error) {
                props.error = error;
                props.error_method = error_method;
            }
            DataService.trackMixpanel(props);
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

.tool_table th.description_col {
    width: 35%;
}

.tool_table td[data-label="Description"] div {
    white-space: normal;
}

.tool_table th.name_col {
    width: 16%;
}

.tool_table th.version_col {
    width: 4.7rem;
}

.tool_table th.type_col {
    width: 4.7rem;
}

.tool_table th.active_col {
    width: 5.8rem;
}
</style>
