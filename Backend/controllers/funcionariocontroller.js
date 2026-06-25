import Funcionario from "../models/Funcionario.js";

// Criar novo funcionário (COM SEGURANÇA)
export const createFuncionario = async (req, res) => {
  try {
    const novoFuncionario = new Funcionario(req.body);
    await novoFuncionario.save();
    res.status(201).json(novoFuncionario);
  } catch (err) {
    // Retorna erro 400 se a validação falhar
    res.status(400).json({ mensagem: "Erro ao cadastrar", detalhes: err.message });
  }
};

// Listar todos os funcionários
export const getFuncionarios = async (req, res) => {
  try {
    const funcionarios = await Funcionario.find();
    res.status(200).json(funcionarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar funcionário
export const deleteFuncionario = async (req, res) => {
  try {
    await Funcionario.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Funcionário deletado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar funcionário (COM SEGURANÇA)
export const updateFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Adicionamos { runValidators: true } para garantir que o Mongoose valide os novos dados antes de salvar no banco
    const updatedFuncionario = await Funcionario.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true } 
    );
    
    if (!updatedFuncionario) {
      return res.status(404).json({ mensagem: "Funcionário não encontrado" });
    }
    
    res.status(200).json(updatedFuncionario);
  } catch (err) {
    res.status(400).json({ mensagem: "Erro ao atualizar", detalhes: err.message });
  }
};