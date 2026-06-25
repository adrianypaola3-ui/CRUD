import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session"; // 1. Importar a sessão
import { login, register } from "./controllers/auth.js";
import funcionarioRoutes from "./routes/funcionarioRoutes.js";

const app = express();

// 2. Configuração de CORS com credentials (para o front-end enviar o cookie de sessão)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// 3. Configuração da Sessão
app.use(session({
  secret: "chave_secreta_do_trabalho", // Em produção, use process.env.SESSION_SECRET
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hora
    httpOnly: true,
  }
}));

// Rotas de Autenticação (devem ser acessíveis publicamente)
app.post("/login", login);
app.post("/register", register);

// Rotas de Funcionários
app.use("/funcionarios", funcionarioRoutes);

const uri = process.env.MONGO_URI; 

mongoose.connect(uri)
  .then(() => {
    console.log("Conectado ao MongoDB Atlas com sucesso!");
    app.listen(8800, () => {
      console.log("Servidor rodando na porta 8800");
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco:", err);
  });