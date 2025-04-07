const usersTokens = Object.freeze({
  Repository: Symbol("Repository"),
  Controller: Symbol("Controller"),
  Services: {
    Me: Symbol.for("ME"),
  },
});

export { usersTokens };
