<template>
    <div class="slds-notify_container">
        <div v-for="(toast, index) in toasts" v-bind:class="setToastType(toast.type)" :key="index"
            class="slds-notify slds-notify_toast" role="status">
            <span class="slds-assistive-text">{{ toast.type }}</span>
            <span class="slds-icon_container slds-m-right_small slds-no-flex slds-align-top"
                :class="`slds-icon-utility-${toast.type}`">
                <svg class="slds-icon slds-icon_small" aria-hidden="true">
                    <use xlink:href="/icons/utility-sprite/svg/symbols.svg#error"></use>
                </svg>
            </span>
            <div class="slds-notify__content">
                <h2 v-html="toast.message" class="slds-text-heading_small"></h2>
            </div>
            <div class="slds-notify__close">
                <button v-on:click="removeToast(toast.Id || 0)"
                    class="slds-button slds-button_icon slds-button_icon-inverse" title="Close">
                    <svg class="slds-button__icon slds-button__icon_large" aria-hidden="true">
                        <!-- <use xlink:href="/icons/utility-sprite/svg/symbols.svg#close" />-->
                    </svg>
                    <span class="slds-assistive-text">Close</span>
                </button>
            </div>
        </div>
    </div>
</template>


<script>

import { defineComponent } from "vue";

export default defineComponent({
    name: 'SLDSToast',
    data() {
        return {
            /** toasters */
            toasts: []
        };
    },
    props: {
        /** time in ms after which the toast message will disappear - default is 10 sec */
        timer: {
            type: Number,
            default: 10000
        }
    },
    methods: {

        /** remove the toast message (either after time has passed or if a user clicks on the cross button) */
        removeToast(id) {
            const index = this.toasts.findIndex(toast => toast.Id === id);
            index > -1 && this.toasts.splice(index, 1);
        },

        /** set the class of the toast depending on the type - success/error/info/warning */
        setToastType(toast_type) {
            let toast_style = "";
            switch (toast_type) {
                case "success":
                    toast_style = "slds-theme_success";
                    break;
                case "error":
                    toast_style = "slds-theme_error";
                    break;
                case "warning":
                    toast_style = "slds-theme_warning";
                    break;
                default:
                    "slds-theme_info";
            }
            return toast_style;
        },

        /** add new toast message */
        addToast(toast) {
            toast.Id = this.toasts.length;
            toast.timer = setTimeout(() => this.removeToast(toast.Id || 0), this.timer);
            this.toasts.push(toast);
        },

        /** remove all toast messages */
        removeAllToasts() {
            this.toasts = [];
        }
    }
});
</script>

<style></style>