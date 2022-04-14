import Vue from "vue";
import VueRouter from "vue-router";
import DatabaseView from "@/views/DatabaseView";
import AdministrationView from "@/views/AdministrationView";
import NetworkView from "@/views/NetworkView";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "network",
    component: NetworkView,
  },
  {
    path: "/database",
    name: "database",
    component: DatabaseView,
  },
  {
    path: "/administration",
    name: "administration",
    component: AdministrationView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
