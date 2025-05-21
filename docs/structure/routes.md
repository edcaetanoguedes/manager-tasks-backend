# Rotas da aplicação

Endpoint padrão:
> /api/v1

## Backend

> ### Listar todas as tarefas
> **GET** /api/v1/tasks

> ### Consultar uma tarefa
> **GET** /api/v1/tasks/:id

> ### Cadastrar uma nova tarefa
> **POST** /api/v1/tasks
```
BODY
{
    "text": "TEXTO DA TAREFA"
}
```

> ### Deletar uma tarefa
> **DELETE** /api/v1/tasks/:id