const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbDir = path.join(process.cwd(), "database"); // Diretório do banco de dados local
const dbPath = path.join(dbDir, "./database.db");

const TABLES = {
  tasks: "tasks",
  tasks_status: "tasks_status",
};

// Opções iniciais de status para tarefas
// "pendente" DEVE ser o primeiro registro da tabela, pois seu ID será utilizado como padrão no cadastro de novas tarefas
const tasks_status_initial = [{ title: "pendente" }, { title: "concluído" }];

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('Pasta "database/" criada com sucesso!');
} else {
  console.log('A pasta "database/" já existe!');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.log("Erro ao abrir o banco de dados: ", err.message);
  }

  console.log("Banco de dados SQLite conectado!");
});

db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS ${TABLES.tasks} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT "${tasks_status_initial[0].title}",
            creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

  db.run(`
        CREATE TABLE IF NOT EXISTS ${TABLES.tasks_status} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,    
          title TEXT UNIQUE NOT NULL
        )`);

  // Inicialização das tabelas

  // Tabela Opções de Status de tarefas
  tasks_status_initial.forEach((status) => {
    db.run(
      `INSERT INTO ${TABLES.tasks_status} (title) VALUES (?)`,
      [status.title],
      (err) => {
        if (err) {
          return console.log(
            `Erro ao adicionar a opção de status "${status.title}"!`,
          );
        }

        console.log(
          `Opção de status(${status.title}) de task adicionada com sucesso!`,
        );
      },
    );
  });

  console.log("Opções de status adicionadas!");

  // db.close((closeErr) => {
  //     if(closeErr) {
  //       console.error("Erro ao fechar o banco de dados!")
  //     } else {
  //       console.error("Conexão com o banco de dados fechada com sucesso!")
  //     }
  //   })
});

module.exports = { db, TABLES };
