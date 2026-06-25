import express from "express";
import { 
  getFuncionarios, 
  createFuncionario, 
  updateFuncionario, 
  deleteFuncionario 
} from "../controllers/funcionariocontroller.js";

// Importe o middleware que criamos
import { verificarAutenticacao } from "../middlewares/middleware.js";

const router = express.Router();

// Rotas: quem pode acessar o quê?
router.get("/", getFuncionarios); // Listar é público (geralmente ok)

// Rotas protegidas: só passa se estiver logado (passando o middleware no meio)
router.post("/", verificarAutenticacao, createFuncionario);
router.put("/:id", verificarAutenticacao, updateFuncionario);
router.delete("/:id", verificarAutenticacao, deleteFuncionario);

export default router;