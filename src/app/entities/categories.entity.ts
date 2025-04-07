import type { BaseEntity } from "./base.entity";
import type { User } from "./user.entity";

type Category = {
  [key in "icon" | "name"]: string;
} & {
  type: "income" | "expense";
  userId: User["$id"];
} & BaseEntity;

export type { Category };
