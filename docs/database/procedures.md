# Lógica dos códigos/funções de manipulação do banco de dados

### função db.get(SELECT... WHERE id = ?)

Retorna um `n registros` ou `undefined`

### função db.all(SELECT... WHERE id = ?)

Retorna um `[]` ou `[ registro1, registro2, ... ]`

#### procedures DELETE

- Verifica a existência do registro com `db.get(SELECT ... WHERE id = ?)`, pois o retorno `rows` será `undefined` caso não encontre o registro.
- Com `rows` retornando **registro** ou `undefined` fica mais fácil de validar.
