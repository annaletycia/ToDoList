//Model referente às tarefas (tasks). Essa é a camada mais baixa que envia para o Controller das tasks.

const connection = require("./connection");

//Função que retorna todas as tasks do banco de dados
const getAll = async () => {
    const [tasks] = await connection.execute("SELECT * FROM tasks");
    return tasks; //retorna ao cliente somente a primeira posição do array, sem o buffer
};

//Função que cadastra nova tarefa no banco de dados
const createTask = async (task) => {

    const { title } = task;

    const dateUTC = new Date(Date.now()).toUTCString(); //gera string da data em UTC

    const query = "INSERT INTO tasks(title, status, created_at) VALUES (?,?,?)";

    const [createdTask] = await connection.execute(query, [title, "pendente", dateUTC]);

    return {inserId: createdTask.insertId};
};

const deleteTask = async (id) => {

    const [removedTask] = await connection.execute("DELETE FROM tasks WHERE id = ?", [id]);
    return removedTask;
};

const updateTask = async (id, task) => {
    
    const { title, status } = task;
    const query = "UPDATE tasks SET title = ?, status = ? WHERE id = ?";
    const [updatedTask] = await connection.execute(query, [title, status, id]);
    return updatedTask;
};

module.exports = {
    getAll,
    createTask,
    deleteTask,
    updateTask,
};