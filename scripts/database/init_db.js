const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbDir = path.join(process.cwd(), "database"); // Diretório do banco de dados local
const dbPath = path.join(__dirname, "../database/database.db");

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
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
});

module.exports = db;
