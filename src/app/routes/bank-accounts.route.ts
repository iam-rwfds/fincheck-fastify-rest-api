import { BaseRouteSet } from "./baseRoute";

const bankAccountsRoute = new BaseRouteSet("bank-accounts");

bankAccountsRoute.add({
  handler: () => {},
  method: "POST",
  url: "",
});

bankAccountsRoute.add({
  handler: () => {},
  method: "PUT",
  url: "/:id",
});

bankAccountsRoute.add({
  handler: () => {},
  method: "DELETE",
  url: "/:id",
});

bankAccountsRoute.add({
  handler: () => {},
  method: "GET",
  url: "",
});

export { bankAccountsRoute };
