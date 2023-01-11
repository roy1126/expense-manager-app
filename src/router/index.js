import Vue from "vue";
import VueRouter from "vue-router";
import Monthly from "@/views/Monthly";
import Profile from "@/views/Profile";
import Calendar from "@/views/Calendar";
import Settings from "@/views/Settings";

Vue.use(VueRouter);

const routes = [
  {
    path: "/profile",
    name: "profile",
    component: Profile,
  },
  {
    path: "/",
    name: "monthly",
    component: Monthly,
  },
  {
    path: "/calendar",
    name: "calendar",
    component: Calendar,
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
