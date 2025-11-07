import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(cors());
app.use(express.json());

let db;
(async () => {
    db = await open({
        filename: "./database.db",
        driver: sqlite3.Database,
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS funcionarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      phone TEXT UNIQUE,
      funcao TEXT,
      senha TEXT,
      isAdmin BIT
    );

    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      funcionario TEXT,
      tarefa TEXT,
      concluida BIT,
      datacriacao DATE,
    );
  `);

    console.log("Banco de dados pronto");
})();

app.get("/funcionarios", async (req, res) => {
    const rows = await db.all("SELECT * FROM funcionarios");
    res.json(rows);
});

app.post("/funcionarios", async (req, res) => {
    const { nome, phone, funcao, senha, isAdmin } = req.body;
    await db.run(
        "INSERT INTO funcionarios (nome, phone, funcao, senha, isAdmin) VALUES (?, ?, ?, ?, ?)",
        [nome, phone, funcao, senha, isAdmin]
    );
    res.json({ message: "Funcionário adicionado" });
});

app.get("/tarefas", async (req, res) => {
    const rows = await db.all(`
    SELECT * FROM tarefas
  `);
    res.json(rows);
});

app.post("/tarefas", async (req, res) => {
    const { funcionario, tarefa, concluida, datacriacao } = req.body;
    await db.run(
        "INSERT INTO tarefas ( funcionario, tarefa, concluida, datacriacao) VALUES (?, ?, ?, ?)",
        [funcionario, tarefa, concluida, datacriacao]
    );
    res.json({ message: "Tarefa criada" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
