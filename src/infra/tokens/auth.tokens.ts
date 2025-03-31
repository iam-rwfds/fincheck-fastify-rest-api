const authTokens = Object.freeze({
  Services: Object.freeze({
    SignUp: Symbol.for("SignUp"),
    SignIn: Symbol.for("SignIn"),
  }),
  Provider: Symbol.for("Provider"),
});

export { authTokens };
