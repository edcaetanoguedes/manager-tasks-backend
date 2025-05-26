const fs = require("fs");
const path = require("path");

const dbDir = path.join(process.cwd(), "database"); // Diretório do banco de dados local
const dbPath = path.join(dbDir, "./database.db");

// Usado para testes: Apaga o banco de dados
fs.unlink(dbPath, (err) => {
  if (err) {
    return console.error(`Erro ao apagar o arquivo: ${err.message}`);
  }
  console.log("Arquivo database.db apagado com sucesso.");
});
