//Model referente as tarefas (tasks)

const connection = require("./connection");

//Função que retorna todas as tasks do banco de dados
const getAll = async () => {
    const tasks = await connection.execute("SELECT * FROM tasks");
    return tasks;
};

module.exports = {
    getAll
};