const express = require("express");
const cors = require("cors"); // controla quais origens externas podem fazer requisições
const bodyParser = require("body-parser");
const Sqlite = require("./scripts/database/procedures");

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

// Consultar todas as opções de tarefas
app.get(`/api/v1/tasks/status`, (req, res) => {
  Sqlite.tasks_selectAllStatus((err, rows) => {
    if (err) {
      console.log("Error: ", err.message);
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(rows);
  });
});

// Consultar uma opção de status pelo ID
app.get(`/api/v1/tasks/status/:id`, (req, res) => {
  const { id } = req.params;

  Sqlite.tasks_selectStatusById(id, (err, rows) => {
    if (err) {
      console.log("Error: ", err.message);
      return res.status(500).json({ error: err.message });
    }

    if (!rows) {
      console.log("Error: ", "Opção de status não encontrada!");
      return res.status(400).json({ error: "Opção de status não encontrada!" });
    }

    res.status(200).json(rows);
  });
});

// Consultar todas as tarefas
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

    if (!rows) {
      console.log("Error: ", "Tarefa não encontrada!");
      return res.status(400).json({ error: "Tarefa não encontrada!" });
    }

    res.status(200).json(rows);
  });
});
// Cadastrar nova tarefa
app.post(`/api/v1/tasks`, (req, res) => {
  const { text } = req.body;

  Sqlite.tasks_submitNewTask({ text }, function (err) {
    if (err) {
      console.log("Error: ", err.message);
      return res.status(500).json({ error: err.message });
    }

    res
      .status(201)
      .json({ id: this.lastID, message: "Tarefa criada com sucesso!" });
  });
});

// Atualizar informações da tarefa
app.put(`/api/v1/tasks/:id`, (req, res) => {
  const { id } = req.params;
  const { text, status } = req.body;

  console.log("id: ", id);
  console.log("text: ", text);
  console.log("status: ", status);

  // Busca a tarefa pelo ID
  Sqlite.tasks_selectById(id, (err, rows) => {
    if (err) {
      console.log("Error: ", err.message);
      return res.status(500).json({ error: err.message });
    }

    // Verifica a existência da tarefa
    if (!rows) {
      return res.status(400).json({ error: "Esta tarefa não existe!" });
    }

    // Busca todos as opções de status de tarefa
    Sqlite.tasks_selectAllStatus((err, rows) => {
      if (err) {
        console.log("Error: ", err.message);
        return res.status(500).json({ error: err.message });
      }

      if (rows && rows.some((task_status) => task_status.title === status)) {
        console.log("Error: ", "Opção de status não encontrada!");
        return res
          .status(400)
          .json({ error: "Opção de status não encontrada!" });
      }

      // Atualiza os dados da tarefa
      Sqlite.tasks_updateById(id, { text, status }, (err) => {
        if (err) {
          console.log("Erro ao atualizar a task!");
          return res.status(500).json({ error: err.message });
        }

        res.status(200).json({ message: "Tarefa atualizada com sucesso!" });
      });
    });
  });
});

// Deletar tarefa pelo ID
app.delete(`/api/v1/tasks/:id`, (req, res) => {
  console.log("Request DELETE /api/v1/tasks/:id");
  const { id } = req.params;

  Sqlite.tasks_selectById(id, (err, rows) => {
    if (err) {
      console.log("Error: ", err.message);
      return res.status(500).json({ error: err.message });
    }

    // Verifica a existência da tarefa
    if (!rows) {
      return res.status(400).json({ error: "Esta tarefa não existe!" });
    }

    // Deleta a tarefa
    Sqlite.tasks_deleteById(id, function (err) {
      if (err) {
        console.log("Error: ", err.message);
        return res.status(500).json({ error: err.message });
      }

      if (this.changes != 1) {
        return res
          .status(500)
          .json({ error: "Algo deu errado enquanto a tarefa era apagada!" });
      }

      res.status(200).json({ message: `Tarefa ${id} apagada com sucesso!` });
    });
  });
});

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});
