import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import DatabaseView from "@/views/DatabaseView";
import AdministrationView from "@/views/AdministrationView";
import NetworkView from "@/views/NetworkView";
import HomeView from "@/views/HomeView";
import HelpView from "@/views/HelpView";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/help",
    name: "help",
    component: HelpView,
  },
  {
    path: "/network",
    name: "network",
    component: NetworkView,
    meta: {
      license: true,
      server: true,
    },
  },
  {
    path: "/database",
    name: "database",
    component: DatabaseView,
    meta: {
      license: true,
      server: true,
    },
  },
  {
    path: "/administration",
    name: "administration",
    component: AdministrationView,
    meta: {
      license: true,
      server: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.license)) {
    if (store.getters.valid) {
      next();
    } else {
      next({ name: "home" });
    }
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.server)) {
    if (store.getters.running) {
      next();
    } else {
      next({ name: "home" });
    }
  } else {
    next();
  }
});

export default router;
