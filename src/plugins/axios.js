import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import getMAC from "getmac";

axios.defaults.baseURL = process.env.VUE_APP_API_URL || "http://localhost:8000";
axios.defaults.timeout = 5000; // 5s
axios.defaults.headers = {
  accept: "application/json",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  Authorization: localStorage.getItem("token") || null,
  mac: getMAC(),
};
Vue.use(VueAxios, axios);

export default {
  root: process.env.VUE_APP_API_URL || "http://0.0.0.0:8000",
};
