<template>
  <template v-if="is_loading">
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
</template>

<script>
import { defineComponent } from "vue";
import authService from "../services/authService";
import PageHeader from "../components/PageHeader.vue";
import PageFooter from "../components/PageFooter.vue";
import PageBody from "../components/PageBody.vue";
import DataService from "../services/data";

export default defineComponent({

  components: {
    PageHeader,
    PageFooter,
    PageBody
  },

  data() {
    return {
      is_authenticated: false,
      is_loading: false,
    };
  },
  async mounted() {
    this.is_authenticated = await authService.checkAuth();

    if (!this.is_authenticated) {
      console.log('Adminview cmp - Error in authenticating');
      DataService.login();
    }
    else {
      this.is_loading = true;
    }
  },
});
</script>

<style></style>