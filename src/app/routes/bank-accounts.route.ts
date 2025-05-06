import type { BankAccountsController } from "~controllers/bank-accounts.controller";
import { container } from "~infra/container";
import { TOKENS } from "~infra/tokens";
import { BaseRouteSet } from "./baseRoute";

const bankAccountsRoute = new BaseRouteSet("bank-accounts");

bankAccountsRoute.add({
  handler: (req, reply) => {
    const bankAccountsController = container.resolve<BankAccountsController>(
      TOKENS.BankAccounts.Controller,
    );

    return bankAccountsController.create(req, reply);
  },
  method: "POST",
  url: "",
  onRequest: (req, reply) => req.server.authenticate(req, reply),
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
