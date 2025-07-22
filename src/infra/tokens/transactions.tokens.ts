const services = Object.freeze({
  Create: Symbol.for("CreateTransactionService"),
  GetAll: Symbol.for("GetAllTransactionsService")
});

const transactionsTokens = Object.freeze({
  Repository: Symbol("TransactionsRepository"),
  Controller: Symbol("TransactionsController"),
  Services: services,
});

export { transactionsTokens };
