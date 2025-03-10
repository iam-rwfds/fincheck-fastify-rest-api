import { BaseRouteSet } from "./baseRoute";

const categoriesRoutes = new BaseRouteSet("categories");

categoriesRoutes.add({
  handler: () => {
    return {
      categories: [],
    };
  },
  method: "GET",
  url: "/mine",
});

export { categoriesRoutes };
