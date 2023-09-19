<template>
  <!-- access denied page -->
  <no-access-error v-if="!is_authenticated" />
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
import NoAccessError from "../components/NoAccessError.vue";
import PageHeader from "../components/PageHeader.vue";
import PageFooter from "../components/PageFooter.vue";
import PageBody from "../components/PageBody.vue";

export default defineComponent({

  components: {
    PageHeader,
    PageFooter,
    PageBody,
    NoAccessError
  },

  data() {
    return {
      is_authenticated: false,
      is_loading: true,
    };
  },
  async created() {
    this.is_authenticated = await authService.checkAuth();

    if (!this.is_authenticated) {
      console.log('Error in authenticating');
      this.is_authenticated = true;
      this.is_loading = false
    }
  },
});
</script>

<style></style>