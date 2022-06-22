import Vue from "vue";
import Vuex from "vuex";

const { ipcRenderer, remote } = require("electron");
const { machineIdSync } = require("node-machine-id");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    machineId: machineIdSync(true),
    isDevelopment: process.env.NODE_ENV !== "production",
    port: process.env.VUE_APP_API_PORT,
    data: null,
    isRunning: false,
    license: { errorCode: 1, key: null },
    trialMode: { finish: false, trial: false },
  },
  getters: {
    machineId: (state) => state.machineId,
    isDevelopment: (state) => state.isDevelopment,
    port: (state) => state.port,
    data: (state) => state.data,
    licenseKey: (state) => state.license.key,
    isActivated: (state) => state.license.errorCode === 0,
    isRunning: (state) => state.isRunning,
    isTrial: (state) => state.trialMode.trial,
    trialFinish: (state) => state.trialMode.finish,
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
    async reset() {
      await ipcRenderer.invoke("reset");
    },
    async updateLicenseKey({ commit }, { license_key }) {
      const response = await ipcRenderer.invoke("set-license", { license_key });
      await commit("setData", { name: "license", data: response });
    },
    async validateLicenseKey({ commit }) {
      const response = await ipcRenderer.invoke("validate-license");
      await commit("setData", { name: "license", data: response });
    },
    async startTrial({ commit }) {
      const response = await ipcRenderer.invoke("start-trial");
      await commit("setData", { name: "trialMode", data: response });
    },
    async validateTrial({ commit }) {
      const response = await ipcRenderer.invoke("validate-trial");
      await commit("setData", { name: "trialMode", data: response });
    },
    async startServer({ commit }) {
      const response = await ipcRenderer.invoke("start-server");
      await commit("setData", { name: "isRunning", data: response });
    },
    async closeServer({ commit }) {
      const response = await ipcRenderer.invoke("close-server");
      await commit("setData", { name: "isRunning", data: response });
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
      await Vue.axios.post("api/data/", { products: data }).catch((error) => {
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
