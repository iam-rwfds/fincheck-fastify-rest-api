import { BaseRouteSet } from "./baseRoute";

const usersRoute = new BaseRouteSet("users");

usersRoute.add({
  handler: () => {},
  method: "GET",
  url: "/me",
});

export { usersRoute };
