import * as v from "valibot";

const SignInSchema = v.object(
  {
    email: v.pipe(
      v.string("O campo de email deve ser uma string"),
      v.nonEmpty("O campo de email não pode estar vazio"),
      v.email("Formato de email inválido"),
    ),
    password: v.pipe(
      v.string("O campo de senha deve ser uma string"),
      v.nonEmpty("O campo de senha não pode estar vazio"),
      v.minLength(8, "A senha deve ter no mínimo 8 caracteres"),
    ),
  },
  "Algum(ns) dos campos estão faltando...",
);

export { SignInSchema };
