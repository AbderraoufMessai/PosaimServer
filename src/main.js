import Vue from "vue";
import App from "@/App.vue";
import store from "@/store";
import router from "@/router";
import vuetify from "@/plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import axios from "@/plugins/axios";
import veeValidate from "@/plugins/vee-validate";

Vue.config.productionTip = false;

new Vue({
  axios,
  store,
  router,
  vuetify,
  veeValidate,
  render: (h) => h(App),
}).$mount("#app");
