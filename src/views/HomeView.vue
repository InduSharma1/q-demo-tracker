<template>
  <!-- for Canvas app-->
  <div>
    <h1> Successfully send the event to Google Analytics</h1>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  mounted() {
    const url_params = new URLSearchParams(window.location.search);
    const page = url_params.get("pageName");
    const org_type = url_params.get("orgType");
    console.log('Home Page -> org_type ', org_type);
    this.$gtag.event('page_view', {
      event_category: org_type,
      event_label: page,
    });
  },
});
</script>

<style></style>

