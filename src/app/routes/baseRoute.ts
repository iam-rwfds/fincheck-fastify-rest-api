import type { RouteOptions } from "fastify";

class BaseRouteSet<
  R extends RouteOptions = RouteOptions,
  P extends string = string,
> extends Set<R> {
  /**
   * Must contain only the prefix name; no `/`'s
   * Okay: "user"
   * NOT Okay: "/user", "/user/", "user/"
   */
  #prefix: string;

  constructor(prefix: P extends `/${string}` ? never : P) {
    super();

    this.#prefix = prefix;
  }

  override add(value: R & { url: `/${string}` | "" }): this {
    // super.add()
    super.add({
      ...value,
      url: this.#prefix
        ? `/api/${this.#prefix}${value.url}`
        : `/api/${value.url}`,
    });

    return this;
  }
}

export { BaseRouteSet };
