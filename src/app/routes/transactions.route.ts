import { BaseRouteSet } from "./baseRoute";

const transactionsRoutes = new BaseRouteSet("transactions");

transactionsRoutes.add({
  handler: () => {},
  method: "GET",
  url: "",
});

transactionsRoutes.add({
  handler: () => {},
  method: "POST",
  url: "",
});

export { transactionsRoutes };
