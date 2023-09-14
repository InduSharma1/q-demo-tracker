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
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get("pageName");
    this.$gtag.event('page_view', {
      event_category: "pageview",
      event_label: page,
    });
  },
});
</script>

<style></style>

