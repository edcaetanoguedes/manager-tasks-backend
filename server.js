const express = require("express");
const cors = require("cors"); // controla quais origens externas podem fazer requisições
const bodyParser = require("body-parser");
const db = require("./scripts/database/init_db");
const Sqlite = require("./scripts/database/procediments");

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

// Consultar todas as tarefas cadastradas
app.get(`/api/v1/tasks`, (req, res) => {
  Sqlite.tasks_selectAll((err, rows) => {
    if (err) {
      console.log("Error: ", err.message);
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(rows);
  });
});

// Consultar uma tarefa pelo ID
app.get(`/api/v1/tasks/:id`, (req, res) => {
  const { id } = req.params;

  Sqlite.tasks_selectById(id, (err, rows) => {
    if (err) {
      console.log("Error: ", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
});

// Cadastrar nova tarefa
app.post(`/api/v1/tasks`, (req, res) => {
  const { text } = req.body;

  Sqlite.tasks_submitNewTask({ text }, (err) => {
    if (err) {
      console.log("Error: ", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Deletar tarefa pelo ID
app.delete(`/api/v1/tasks/:id`, (req, res) => {
  console.log("Request DELETE /api/v1/tasks/:id");
  const { id } = req.params;

  Sqlite.tasks_deleteTaskById(id, (err) => {
    if (err) {
      console.log("Error: ", err.message);
      return res.status(500).send({ error: "Erro ao remover tarefa!" });
    }

    // Caso a tarefa não seja encontrada
    if (this.changes == 0) {
      console.log("Error: ", "Tarefa não encontrada!");
      return res.status(500).send({ error: "Tarefa não encontrada!" });
    }

    res.status(200).json({ message: "Tarefa removida com sucesso!" });
  });
});

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});
