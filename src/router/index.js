// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../Dashboard.vue";
import Login from "../Login.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const auth = getAuth();

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (!requiresAuth) {
    return next();
  }

  const user = auth.currentUser;

  if (user) {
    const isGoogleUser = user.providerData.some(
      (provider) => provider.providerId === "google.com"
    );
    if (isGoogleUser) {
      return next();
    } else {
      alert("Bạn phải đăng nhập bằng Google");
      return next("/");
    }
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const isGoogleUser = user.providerData.some(
        (provider) => provider.providerId === "google.com"
      );
      if (isGoogleUser) {
        next();
      } else {
        alert("Bạn phải đăng nhập bằng Google");
        next("/");
      }
    } else {
      next("/");
    }
  });
});

export default router;
