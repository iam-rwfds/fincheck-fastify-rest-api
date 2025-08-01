const categoriesTokens = Object.freeze({
  Repository: Symbol("Repository"),
  Services: Object.freeze({
    Mine: Symbol.for("CategoriesMineService")
  }),
  Controller: Symbol.for("CategoriesController")
});

export { categoriesTokens };
