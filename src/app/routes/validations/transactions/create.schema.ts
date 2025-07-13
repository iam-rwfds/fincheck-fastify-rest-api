import * as v from "valibot";
import type { TransactionType } from "../../../entities/transaction.entity";

const CreateTransactionSchema = v.object({
  value: v.number(),
  type: v.pipe(
    v.string(),
    v.picklist(["expense", "income"] satisfies TransactionType[]),
  ),
  date: v.pipe(v.string()),
  name: v.pipe(v.string(), v.nonEmpty()),
  bankAccountId: v.pipe(v.string(), v.nonEmpty()),
});

export { CreateTransactionSchema };
