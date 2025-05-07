const services = Object.freeze({
  Create: Symbol("CreateBankAccountService"),
  AssertUserRelation: Symbol("AssertUserRelationService"),
  Update: Symbol("UpdateBankAccountService"),
});

const bankAccountsTokens = Object.freeze({
  Repository: Symbol("BankAccountRepository"),
  Controller: Symbol("BankAccountController"),
  Services: services,
});

export { bankAccountsTokens };
