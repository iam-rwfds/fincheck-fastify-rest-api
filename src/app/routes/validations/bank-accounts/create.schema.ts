import * as v from "valibot";
import { BANK_ACCOUNT_TYPES } from "../../../entities/bank-account.entity";

const CreateBankAccountSchema = v.object({
  initialBalance: v.pipe(v.number(), v.integer()),
  name: v.pipe(v.string(), v.nonEmpty()),
  type: v.pipe(
    v.string(),
    v.nonEmpty(),
    v.picklist(Object.values(BANK_ACCOUNT_TYPES)),
  ),
  color: v.pipe(
    v.string(),
    v.nonEmpty(),
    v.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  ),
});

export { CreateBankAccountSchema };
