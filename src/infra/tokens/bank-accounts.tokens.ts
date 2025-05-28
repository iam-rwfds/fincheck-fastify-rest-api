const services = Object.freeze({
  Create: Symbol("CreateBankAccountService"),
  AssertUserRelation: Symbol("AssertUserRelationService"),
  Update: Symbol("UpdateBankAccountService"),
  GetAllFromUser: Symbol("GetAllBankAccountsFromUserService"),
});

const bankAccountsTokens = Object.freeze({
  Repository: Symbol("BankAccountRepository"),
  Controller: Symbol("BankAccountController"),
  Services: services,
});

export { bankAccountsTokens };
