import "./assets/main.css"
import { createApp } from "vue"
import App from "./App.vue"
import { Amplify } from "aws-amplify"
import outputs from "../amplify_outputs.json"

import BootstrapVue3 from 'bootstrap-vue-3'

// Import Bootstrap CSS and BootstrapVue styles
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

Amplify.configure(outputs)

const app = createApp(App)
app.use(BootstrapVue3)
app.mount('#app')
