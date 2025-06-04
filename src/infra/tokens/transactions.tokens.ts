const services = Object.freeze({
  Create: Symbol.for("CreateTransactionService"),
});

const transactionsTokens = Object.freeze({
  Repository: Symbol("TransactionsRepository"),
  Controller: Symbol("TransactionsController"),
  Services: services,
});

export { transactionsTokens };
