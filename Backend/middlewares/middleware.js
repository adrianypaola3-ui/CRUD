// authMiddleware.js
export const verificarAutenticacao = (req, res, next) => {
  if (req.session && req.session.userId) {
    next(); // Está logado, pode passar
  } else {
    res.status(401).json("Acesso negado! Faça login primeiro.");
  }
};