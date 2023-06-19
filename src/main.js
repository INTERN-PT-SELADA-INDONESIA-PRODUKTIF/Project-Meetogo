import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
// import '@popperjs/core'
import Swal from 'sweetalert2'

createApp(App).use(store).use(router).mount('#app')
window.Swal = Swal
