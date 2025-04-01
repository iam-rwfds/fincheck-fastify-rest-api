import type { BaseEntity } from "./base.entity";

type User = {
  [key in "email" | "name" | "password"]: string;
} & BaseEntity;

export type { User };
