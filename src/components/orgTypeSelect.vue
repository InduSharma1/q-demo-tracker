<template>
  <!-- spinner -->
  <Spinner v-if="loading"></Spinner>

  <!-- toasters -->
  <Toast ref="toastCmp" :timer="5000" />

  <!-- Picklist for Org goes here -->
  <div class="slds-form-element">
    <label class="slds-form-element__label" for="select-org_type">Select an Org Type:</label>
    <SLDSPicklist :column="filter_org_list" :emit_direct="true" @on-change="selectedOrgChanged" :value="org_selected">
    </SLDSPicklist>
    <dl id="org-id" class="slds-form-element__help slds-dl_inline">
      <dt class="slds-dl_inline__label slds-text-color_weak slds-truncate" title="Org ID">Org Type ID:</dt>
      <dd class="slds-dl_inline__detail slds-text-font_monospace slds-truncate">{{ org_selected.value }}</dd>
    </dl>
  </div>
</template>

<script>

import { defineComponent } from "vue";
import SLDSPicklist from "./SLDS/Picklist.vue";
import Spinner from "./SLDS/Spinner.vue";
import Toast from "./SLDS/Toast.vue";
// api services
import DataService from '../services/data';

export default defineComponent({

  name: "OrgTypeSelect",

  components: {
    Toast,
    SLDSPicklist,
    Spinner
  },
  props: {
    org_default: {
      type: Object,
    }
  },
  emits: ['onSelect'],
  data() {
    return {
      /** filter by picklist field */
      filter_org_list: {},
      /** Org list */
      org_list: [],
      /** to show the spinner when data is loaded */
      loading: false,
      /**Selected org  in the dropdown */
      org_selected: {},
    }
  },
  mounted() {
    if (this.org_default) {
      this.org_selected = this.org_default;
    }
    this.fetchOrgKeyFromServer();
  },

  methods: {
    /** fetch the Org list from API - Q Keys*/
    async fetchOrgKeyFromServer() {
      try {
        this.loading = true;
        const result = await DataService.getOrgKey();
        if (result.data && !result.data.error) {
          result.data.keys.forEach((element) => {
            if (element.is_retired == false && element.org62__trialforce_id != null) {
              this.org_list.push(element);
            }
          });
        } else if (result.data && result.data.error) {
          this.showToasts('error', result.data.error || 'Some error occured while fetching the data. Please try again!');
        }
        this.makeColumns();
        this.loading = false;
      } catch (error) {
        console.log("OrgTypeSelected - fetchOrgKeyFromServer - error in fetch Org -", error);
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
    /** picklist values create */
    makeColumns() {
      const picklist_values = this.org_list.map((element) => {
        return {
          active: true,
          validFor: null,
          value: element.identifier,
          label: element.name

        }
      });

      this.filter_org_list = {
        name: 'Filter_Org_List',
        type: 'picklist',
        label: 'Filter by:',
        picklistValues: picklist_values,
        required: false,
        defaultValue: 'all',
        hideLabel: true
      };
    },

    /** called when the Org selected is changed */
    selectedOrgChanged(event) {
      const { name, value } = event;
      this.org_selected.label = name;
      this.org_selected.value = value;
      this.$emit('onSelect', {
        name: name,
        value: value
      })
    },
  },
});
</script>
  
<style></style>
