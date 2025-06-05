// Export all route configurations
export {
  routes,
  getRouteByPath,
  getRouteByName,
  getAllRoutes,
  getAuthenticatedRoutes,
  getPublicRoutes,
} from "./routeTree";

// Re-export individual routes for convenience
export const {
  home: homeRouteConfig,
  auth: authRouteConfig,
  dashboard: dashboardRouteConfig,
} = routes;
