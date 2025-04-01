import * as v from "valibot";

const SignUpSchema = v.object(
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
    name: v.pipe(
      v.string("O campo de nome deve ser uma string"),
      v.nonEmpty("O campo de nome não pode estar vazio"),
    ),
  },
  "Algum(ns) dos campos estão faltando...",
);

export { SignUpSchema };
