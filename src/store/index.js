import Vue from "vue";
import Vuex from "vuex";

const { ipcRenderer, remote } = require("electron");
const { machineIdSync } = require("node-machine-id");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    license: null,
    machineId: machineIdSync(true),
    server_is_running: false,
    data: null,
    port: process.env.VUE_APP_API_PORT,
  },
  getters: {
    valid: (state) => (state.license ? state.license.errorCode === 0 : false),
    license: (state) => state.license,
    machineId: (state) => state.machineId,
    port: (state) => state.port,
    serverIsRunning: (state) => state.server_is_running,
    data: (state) => state.data,
  },
  mutations: {
    setData: (state, { name, data }) => {
      state[name] = data;
    },
    newItem: (state, { name, item }) => {
      state[name].push(item);
    },
    updateItem: (state, { name, item }) => {
      const index = state[name].findIndex((i) => i.id === item.id);
      if (index !== -1) {
        state[name].splice(index, 1, item);
      }
    },
    deleteItem: (state, { name, item }) => {
      const index = state[name].findIndex((i) => i.id === item.id);
      if (index !== -1) {
        state[name].splice(index, 1);
      }
    },
  },
  actions: {
    async updateLicenseKey({ commit }, { license_key }) {
      const response = await ipcRenderer.invoke("set-license", { license_key });
      await commit("setData", { name: "license", data: response });
    },
    async verifyLicenseKey({ commit }) {
      const response = await ipcRenderer.invoke("verify-license");
      await commit("setData", { name: "license", data: response });
    },
    async startServer({ commit }) {
      const response = await ipcRenderer.invoke("start-server");
      await commit("setData", { name: "server_is_running", data: response });
    },
    async closeServer({ commit }) {
      const response = await ipcRenderer.invoke("close-server");
      await commit("setData", { name: "server_is_running", data: response });
    },
    async closeWindow() {
      remote.getCurrentWindow().close();
    },
    async minimizeWindow() {
      remote.getCurrentWindow().minimize();
    },
    async openConsole() {
      await ipcRenderer.send("open-console");
    },
    async exportDatabase({ commit }) {
      let errors = null;
      await Vue.axios
        .get("api/data/")
        .then((response) => {
          commit("setData", { name: "data", data: response.data });
        })
        .catch((error) => {
          errors = error;
        });
      return errors;
    },
    async importDatabase(store, data) {
      let errors = null;
      await Vue.axios.post("api/data/", { data }).catch((error) => {
        errors = error;
      });
      return errors;
    },
    async clearDatabase() {
      let errors = null;
      await Vue.axios.delete("api/data/").catch((error) => {
        errors = error;
      });
      return errors;
    },
    async createAdmin(store, data) {
      let errors = null;
      await Vue.axios.post("api/administration/", data).catch((error) => {
        errors = error;
      });
      return errors;
    },
    async updateAdmin(store, data) {
      let errors = null;
      await Vue.axios.post("api/administration/", data).catch((error) => {
        errors = error;
      });
      return errors;
    },
  },
});
