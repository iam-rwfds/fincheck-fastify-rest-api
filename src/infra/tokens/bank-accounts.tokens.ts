const services = Object.freeze({
  Create: Symbol("CreateBankAccountService"),
});

const bankAccountsTokens = Object.freeze({
  Repository: Symbol("BankAccountRepository"),
  Controller: Symbol("BankAccountController"),
  Services: services,
});

export { bankAccountsTokens };
