<template>
    <div class="slds-grid slds-grid--frame slds-text-align--center">
        <div class="slds-col slds-grid slds-wrap slds-grid--vertical-stretch">
            <div
                class="slds-col slds-size--1-of-1 slds-grid slds-wrap slds-grid--vertical-align-center slds-grid--align-center">
                <div class="slds-size--1-of-1 slds-m-bottom--xx-large">
                    <img alt="Access Denied" class="illustration" src="./../../public/no_access.png" />
                </div>
                <div class="slds-size--1-of-1 slds-m-bottom--small slds-m-top--medium">
                    <h1 class="slds-text-heading--large">No Access</h1>
                </div>
                <div class="slds-size--1-of-1">
                    <h2 class="slds-text-heading--small">You are unauthorized to use this utility.</h2>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "NoAccessError"
});
</script>

<style>
.illustration {
    zoom: 60%;
    max-width: 85%;
}

body {
    height: 100% !important;
}

.page-footer {
    background: #063C6C;
    width: 100%;
    height: 120px;
    padding-top: .8rem !important;
}
</style>