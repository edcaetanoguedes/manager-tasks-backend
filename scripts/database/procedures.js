const { db, TABLES } = require("./init_db");

// Retorna todas as tasks
function tasks_selectAll(callback) {
  db.all(`SELECT * FROM ${TABLES.tasks}`, [], callback);
}

// Retorna um task pelo ID
function tasks_selectById(task_id, callback) {
  db.get(`SELECT * FROM ${TABLES.tasks} WHERE id = ?`, [task_id], callback);
}

// Retorna todas opções de status para tasks
function tasks_selectAllStatus(callback) {
  db.all(`SELECT * FROM ${TABLES.tasks_status}`, [], callback);
}

// Retorna opção de status de task pelo ID
function tasks_selectStatusById(id, callback) {
  db.get(`SELECT * FROM ${TABLES.tasks_status} WHERE id = ${id}`, callback);
}

// Cadastra uma nova task
function tasks_submitNewTask(payload, callback) {
  const { text } = payload;
  db.run(`INSERT INTO ${TABLES.tasks} (text) VALUES (?)`, [text], callback);
}

// Atualiza informações da task
function tasks_updateById(id, payload, callback) {
  const { text, status } = payload;
  var setters = [],
    complement = "";

  // Construção modular da query
  var query = `UPDATE ${TABLES.tasks} SET `;

  if (text) {
    setters.push(`text = "${text}"`);
  }

  // Acrescenta a coluna status na query + uma condição de que o status recebido deve constar na tabela tasks_status
  if (status) {
    setters.push(`status = "${status}"`);
    complement += ` AND EXISTS (SELECT 1 FROM ${TABLES.tasks_status} WHERE title = "${status}")`;
  }

  // Add ',' quando houver mais de uma coluna para atualizar
  for (let index = 0; index < setters.length; index++) {
    query += setters[index];

    if (index < setters.length - 1) {
      query += ", ";
    }
  }

  query += ` WHERE id = ${id}`;
  query += complement;

  console.log(query);

  db.run(query, callback);
}

// Deleta uma task pelo ID
function tasks_deleteById(id, callback) {
  db.run(
    `DELETE FROM ${TABLES.tasks} WHERE id = ${id} AND EXISTS (SELECT 1 FROM ${TABLES.tasks} WHERE id = ${id})`,
    callback,
  );
}

module.exports = {
  tasks_selectAll,
  tasks_selectById,
  tasks_selectAllStatus,
  tasks_selectStatusById,
  tasks_submitNewTask,
  tasks_updateById,
  tasks_deleteById,
};
