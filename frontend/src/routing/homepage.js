
// Home page route configuration
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";
import DashboardPage from "../pages/DashboardPage";

export const routes = {
  home: { path: "/", component: HomePage, requiresAuth: true },
  auth: { path: "/auth", component: AuthPage, requiresAuth: false },
  dashboard: { path: "/dashboard", component: DashboardPage, requiresAuth: true }
};
