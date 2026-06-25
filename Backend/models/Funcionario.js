import mongoose from "mongoose";

const funcionarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true, // Garante que o banco nunca aceite o mesmo nome
    trim: true    // Remove espaços vazios antes/depois do nome
  },
  salario: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

export default mongoose.model("Funcionario", funcionarioSchema);