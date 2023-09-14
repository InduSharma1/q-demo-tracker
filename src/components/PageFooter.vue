<template>
    <div class="slds-docked-form-footer">
        <footer>
            <div class="slds-m-bottom_small">
                <div class="slds-media slds-media_small" style="justify-content: center;">
                    <div class="slds-media__figure slds-p-right_xx-small">
                        <div class="slds-media__body text-color">
                            <img src="./../../public/poweredbyq-light.png" class="footer-image">
                        </div>
                    </div>
                </div>
            </div>

            <div class="slds-grid">
                <a class="text-color" :href="help_link" target="_blank">{{ help_label }} </a>
                <div class="slds-p-left_medium slds-p-right_medium text-color">.</div>
                <a class="text-color" :href="contact_link" target="_blank">{{ contact_label }}</a>
            </div>
        </footer>
    </div>
</template>

<script>

import { defineComponent } from "vue";

export default defineComponent({
    name: "PageFooter",
    data() {
        return {
            help_label: '',
            contact_label: '',
            feedback_label: '',
            help_link: '',
            contact_link: '',
            feedback_settings: ''
        }
    },
    created() {
        this.help_label = 'FIND SDO ON SLACK';
        this.contact_label = 'VISIT SDO ON SOLUTIONS CENTRAL';
        this.feedback_label = 'GIVE FEEDBACK';
        this.help_link = 'https://salesforce-internal.slack.com/archives/C01H08FJJRX';
        this.contact_link = 'https://solutionscentral.io/topics/0b069270-8e1c-11ea-9520-f956e9e1de49/sdo-simple-demo-org/';
        this.feedback_settings = '"", "toolbar=no,status=no,menubar=no,location=center,resizable=no,height=600,width=500"'
    }
});


</script>
<style scoped>
.slds-docked-form-footer {
    background-color: rgb(30, 30, 63);
}

.text-color {
    color: white;
}

.footer-image {
    width: 13.5rem;
    height: 2rem;
}
</style>