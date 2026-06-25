import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  // Estados para capturar dados do formulário de cadastro
  const [nome, setNome] = useState("");
  const [salario, setSalario] = useState("");
  
  // Estado para armazenar a lista de funcionários vinda da API
  const [funcionarios, setFuncionarios] = useState([]);
  
  // Estados para gerenciar a edição de um funcionário específico
  const [editandoId, setEditandoId] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [novoSalario, setNovoSalario] = useState("");

  // Função para buscar os funcionários no servidor
  const carregarFuncionarios = async () => {
    try {
      const res = await axios.get("http://localhost:8800/funcionarios");
      setFuncionarios(res.data);
    } catch (err) { console.error(err); }
  };

  // Carrega a lista de funcionários ao montar o componente
  useEffect(() => { carregarFuncionarios(); }, []);

  // Função para cadastrar novo funcionário
  const salvarFuncionario = async (e) => {
    e.preventDefault();

    // Validação básica: checa se o nome já existe na lista atual
    const existe = funcionarios.find(f => f.nome.toLowerCase() === nome.toLowerCase().trim());
    if (existe) {
      alert("Este funcionário já está cadastrado!");
      return;
    }

    // Formatação do salário: transforma string "1.000,00" para número 1000.00
    const salarioFinal = parseFloat(salario.toString().replace(/\./g, "").replace(",", "."));

    try {
      await axios.post("http://localhost:8800/funcionarios", { nome, salario: salarioFinal });
      alert("Cadastrado com sucesso!");
      setNome(""); setSalario(""); // Limpa os campos após salvar
      carregarFuncionarios(); // Atualiza a lista
    } catch (err) {
      alert("Erro: " + (err.response?.data?.message || "Dados inválidos"));
    }
  };

  // Função para salvar a edição de um funcionário existente
  const salvarEdicao = async (id) => {
    const salarioFinal = parseFloat(novoSalario.toString().replace(/\./g, "").replace(",", "."));
    try {
      await axios.put(`http://localhost:8800/funcionarios/${id}`, { nome: novoNome, salario: salarioFinal });
      setEditandoId(null); // Sai do modo de edição
      carregarFuncionarios(); // Atualiza a lista
    } catch (err) { alert("Erro ao atualizar."); }
  };

  // Função para remover um funcionário
  const deletarFuncionario = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/funcionarios/${id}`);
      carregarFuncionarios(); // Atualiza a lista após deletar
    } catch (err) { alert("Erro ao deletar"); }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Gestão de Funcionários</h1>
      
      {/* Formulário de Cadastro */}
      <form onSubmit={salvarFuncionario} style={{ marginBottom: "20px" }}>
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input type="text" placeholder="Salário" value={salario} onChange={(e) => setSalario(e.target.value)} required />
        <button type="submit">Cadastrar</button>
      </form>

      <h2>Lista</h2>
      <ul>
        {/* Mapeia e renderiza a lista de funcionários */}
        {funcionarios.map((f) => (
          <li key={f._id} style={{ marginBottom: "10px" }}>
            {/* Verifica se o item está em modo de edição */}
            {editandoId === f._id ? (
              <>
                <input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
                <input value={novoSalario} onChange={(e) => setNovoSalario(e.target.value)} />
                <button onClick={() => salvarEdicao(f._id)}>Salvar</button>
                <button onClick={() => setEditandoId(null)}>Cancelar</button>
              </>
            ) : (
              // Modo de visualização normal
              <>
                {f.nome} - R$ {f.salario.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                <button onClick={() => { setEditandoId(f._id); setNovoNome(f.nome); setNovoSalario(f.salario); }}>Editar</button>
                <button onClick={() => deletarFuncionario(f._id)} style={{ color: "red" }}>Deletar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;