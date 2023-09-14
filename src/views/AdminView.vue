<template>
  <div>
    <!-- page header -->
    <page-header />

    <!-- page body -->
    <div class="slds-col slds-grid slds-grid_vertical slds-p-top_none">
      <page-body />
    </div>

    <!-- page footer -->
    <page-footer />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import PageHeader from "../components/PageHeader.vue";
import PageFooter from "../components/PageFooter.vue";
import PageBody from "../components/PageBody.vue";
import DataService from './../services/data';

export default defineComponent({

  components: {
    PageHeader,
    PageFooter,
    PageBody
  },
  mounted() {
    DataService.trackMixpanel({ action: 'Page View' });
  }
});
</script>

<style></style>