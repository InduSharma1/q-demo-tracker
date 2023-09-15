<template>
  <div class="slds-grid slds-grid_frame slds-wrap slds-grid_vertical slds-grid_vertical-stretch slds-p-around_medium">
    <!-- access denied page -->
    <no-access-error v-if="!is_authenticated"></no-access-error>
    <template v-if="is_loading">
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import authService from "./services/authService";
import NoAccessError from "./components/NoAccessError.vue";

export default defineComponent({
  components: {
    NoAccessError,
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

<style>
@import url('../node_modules/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css');

#app {
  font-family: Salesforce Sans;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #181818;
  background-color: white;
  /** #f3f3f3 */
}
</style>
