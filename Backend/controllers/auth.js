import Funcionario from "../models/Funcionario.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    const novoFuncionario = new Funcionario({ ...req.body, password: hashedPassword });
    await novoFuncionario.save();
    
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};

export const login = async (req, res) => {
  try {
    const user = await Funcionario.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("Usuário não encontrado!");
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Senha incorreta!");

    // CRIA A SESSÃO: Armazena o ID do usuário no servidor
    req.session.userId = user._id; 

    res.status(200).json({ message: "Login realizado com sucesso!" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const logout = (req, res) => {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.status(200).json("Deslogado com sucesso!");
};