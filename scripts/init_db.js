const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.join(__dirname, "../database/database.db");

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
            text TEXT
        )`);
});

module.exports = db;
