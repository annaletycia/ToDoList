//Middleware que intermeia dados enviados pela aplicação e funções que lidaram com esses dados, tratando possíveis erros

//Função que valida o título do corpo da requisição
const validateFieldTitle = (req, res, next) => {
  const { body } = req;

  if (body.title == undefined) {
    return res.status(400).json({ message: "The field 'title' is required" });
  }
  if (body.title == "") {
    return res.status(400).json({ message: "The field 'title' is empty" });
  }

  //Caso o título não esteja undefined ou vazio, passa para o próximo middleware
  next();
};

//Função que valida o título do corpo da requisição
const validateFieldStatus = (req, res, next) => {
  const { body } = req;

  if (body.status == undefined) {
    return res.status(400).json({ message: "The field 'status' is required" });
  }
  if (body.status == "") {
    return res.status(400).json({ message: "The field 'status' is empty" });
  }

  //Caso o título não esteja undefined ou vazio, passa para o próximo middleware
  next();
};

module.exports = {
    validateFieldTitle,
    validateFieldStatus,
};