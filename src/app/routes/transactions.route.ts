import type { TransactionsController } from "~controllers/transactions.controller";
import { container } from "~infra/container";
import { TOKENS } from "~infra/tokens";
import { BaseRouteSet } from "./baseRoute";

const transactionsRoutes = new BaseRouteSet("transactions");

transactionsRoutes.add({
  handler: () => {},
  method: "GET",
  url: "",
});

transactionsRoutes.add({
  handler: (req, reply) => {
    const transactionsController = container.resolve<TransactionsController>(
      TOKENS.Transactions.Controller,
    );

    return transactionsController.create(req, reply);
  },
  method: "POST",
  url: "",
  onRequest: (req, reply) => req.server.authenticate(req, reply),
});

export { transactionsRoutes };
