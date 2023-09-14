<template>
    <div class="slds-page-header" :style="{ 'background-color': header_background_color }">
        <div class="slds-media slds-media_center">
            <div class="slds-media__figure">
                <span class="slds-icon_container">
                    <svg id="logo" :class="icon_background_style" class="slds-icon" aria-hidden="true">
                        <use :xlink:href="icon_path"></use>
                    </svg>
                </span>
            </div>
            <div class="slds-media__body" @click="show_popup = false">
                <p class="slds-page-header__title slds-truncate slds-align-middle" :title="app_name">{{ app_name }}</p>
                <p class="slds-text-body_small slds-page-header__info">{{ app_description }}</p>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent } from "vue";

export default defineComponent({

    name: "PageHeader",

    data() {
        return {
            app_name: import.meta.env.VITE_APP_NAME,
            app_description: import.meta.env.VITE_APP_DESCRIPTION,
            icon_background_style: '',
            header_background_color: '',
            icon_path: '',
            show_popup: false,
        }
    },
    created() {
        // this.app_name = 'Q Demo Tracker';
        // this.app_description = 'Help Demo Architects with data driven decisions';
        this.header_background_color = '#FFFFFF';
        this.icon_background_style = 'slds-icon slds-icon-standard-default';
        this.icon_path = `/icons/custom-sprite/svg/symbols.svg#custom25`;
    }
});
</script>
  
<style scoped>
.slds-page-header__icon {
    border-radius: 0.25rem;
}

.slds-page-header {
    height: 75px;
}

.slds-page-header__info {
    font-size: small;
    /* color: #747474; */
}

.username {
    padding-left: 3.2rem;
}
</style>
  