import Vue from "vue";
import App from "@/App.vue";
import store from "@/store";
import router from "@/router";
import vuetify from "@/plugins/vuetify";
import axios from "@/plugins/axios";
import veeValidate from "@/plugins/vee-validate";
// import "roboto-fontface/css/roboto/roboto-fontface.css";

// Vue.config.productionTip = false;
Vue.config.productionTip = true;

new Vue({
  axios,
  store,
  router,
  vuetify,
  veeValidate,
  render: (h) => h(App),
  created() {
    this.$router.push({ name: "home" }).catch(() => {});
  },
}).$mount("#app");
