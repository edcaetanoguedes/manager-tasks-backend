const db = require("./init_db");

const TABLES = {
  tasks: "tasks",
};

// Retorna todas as tasks
function tasks_selectAll(callback) {
  db.all(`SELECT * FROM ${TABLES.tasks}`, [], callback);
}

// Retorna um tarefa pelo ID
function tasks_selectById(task_id, callback) {
  db.all(`SELECT * FROM ${TABLES.tasks} WHERE id = ?`, [task_id], callback);
}

// Cadastra uma nova task
function tasks_submitNewTask(payload, callback) {
  const { text } = payload;
  db.run(`INSERT INTO ${TABLES.tasks} (text) VALUES (?)`, [text], callback);
}

// Deleta uma task pelo ID
function tasks_deleteTaskById(id, callback) {
  db.run(`DELETE FROM ${TABLES.tasks} WHERE id = ?`, [id], callback);
}

module.exports = {
  tasks_selectAll,
  tasks_selectById,
  tasks_submitNewTask,
  tasks_deleteTaskById,
};
