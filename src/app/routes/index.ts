import { authRoutes } from "./auth.route";
import { bankAccountsRoute } from "./bank-accounts.route";
import { categoriesRoutes } from "./categories.route";
import { transactionsRoutes } from "./transactions.route";
import { usersRoute } from "./users.route";

const routes = [
  ...authRoutes,
  ...bankAccountsRoute,
  ...categoriesRoutes,
  ...transactionsRoutes,
  ...usersRoute,
];

export { routes };
