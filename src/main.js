import { createApp } from 'vue'
import App from './App.vue'
import store from "./store"
import router from './router'
import VueGtag from "vue-gtag-next"
import SetupInterceptor from './services/interceptor';

SetupInterceptor();

const app = createApp(App)
app.use(store)
app.use(router)

const url_params = new URLSearchParams(window.location.search);
const email = url_params.get("email");
app.use(VueGtag, {
    property: {
        id: "G-9M1JV4STMX",
        params: {
            user_properties: {
                user_email: email,
            },
            useDebugger: true,
            cookie_flags: "max-age=7200;secure;samesite=none",
        },
    },
});

app.mount('#app')
