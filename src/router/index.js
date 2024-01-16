import Vue from "vue";
import VueRouter from "vue-router";
import occupHealthpages from "./occupHealhPages";
import { mobileRoutes } from "./mobile";
import { tools } from "../utils";
const layout = () => import("../layouts/index.vue");
const login = () => import("../views/login/index.vue");
const loginM = () => import("../views/mobile/login/index.vue");
const dashboard = () => import("../views/mobile/dashboard/index.vue");
const auditList = require("../views/occupHealhPages/auditList");

Vue.use(VueRouter);
// const isProd = process.env.NODE_ENV === "production";

const originalPath = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPath.call(this, location).catch((e) => {
    e;
  });
};

let routes = [];

const routesP = [
  {
    path: "/pages",
    name: "Layout",
    component: layout,
    children: occupHealthpages,
  },
  {
    path: "/login",
    component: login,
  },
  {
    path: "/",
    redirect: "/pages",
  },
  {
    path: "*",
    redirect: "/pages",
  },
];

const routesM = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: dashboard,
  },
  {
    path: "/auditList",
    name: "领用清单审核列表",
    component: auditList.default,
    meta: {
      title: "领用清单审核列表",
    },
  },
  {
    path: "/login",
    component: loginM,
  },
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "*",
    redirect: "/dashboard",
  },
];
console.log("isMobile", tools.isMobile());
if (tools.isMobile()) {
  routes = [...routesM, ...mobileRoutes];
} else {
  routes = routesP;
}

const router = new VueRouter({
  // mode: "history",
  base: "/",
  routes,
});

router.beforeEach((to, from, next) => {
  let currentUserId = sessionStorage.getItem("currentUserId");
  const token = tools.getUrlQueryString("token") || "";
  console.log("detailedList", to);

  if (currentUserId || (token && to.path == "/pages/detailedList")) {
    console.log("33333", to);
    sessionStorage.setItem("path", `${to.path}`);
    sessionStorage.setItem("query", JSON.stringify(to.query));
    if (to.query.token) {
      sessionStorage.setItem("token", to.query.token);
    }
    next();
  } else {
    if (to.path == "/login") {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
