// Simple route configuration for modular organization
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";
import DashboardPage from "../pages/DashboardPage";

// Route definitions
export const routes = {
  home: {
    path: "/",
    component: HomePage,
    name: "Home",
    requiresAuth: true,
  },
  auth: {
    path: "/auth",
    component: AuthPage,
    name: "Authentication",
    requiresAuth: false,
  },
  dashboard: {
    path: "/dashboard",
    component: DashboardPage,
    name: "Dashboard",
    requiresAuth: true,
  },
};

// Route utilities
export const getRouteByPath = (path) => {
  return Object.values(routes).find((route) => route.path === path);
};

export const getRouteByName = (name) => {
  return routes[name];
};

export const getAllRoutes = () => {
  return Object.values(routes);
};

export const getAuthenticatedRoutes = () => {
  return Object.values(routes).filter((route) => route.requiresAuth);
};

export const getPublicRoutes = () => {
  return Object.values(routes).filter((route) => !route.requiresAuth);
};
