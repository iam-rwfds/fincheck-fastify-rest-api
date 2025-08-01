import { container } from "~infra/container";
import { BaseRouteSet } from "./baseRoute";
import { TOKENS } from "~infra/tokens";
import type { CategoriesController } from "~controllers/categories.controller";

const categoriesRoutes = new BaseRouteSet("categories");

categoriesRoutes.add({
  handler: (req, reply) => {
    const categoriesControllers = container.resolve<CategoriesController>(TOKENS.Categories.Controller);

    return categoriesControllers.show(req, reply);
  },
  method: "GET",
  url: "/mine",
  onRequest: (req, reply) => req.server.authenticate(req, reply),
});

export { categoriesRoutes };
