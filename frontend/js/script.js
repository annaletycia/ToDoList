const tbody = document.querySelector("tbody");
const addForm = document.querySelector(".add-form");
const inputTask = document.querySelector(".input_task"); 

//Função que busca e retorna um array das tasks do servidor
const fetchTasks = async () => {

    try{
        const response = await fetch("http://localhost:3333/tasks");

        if(!response.ok)
            throw new Error(`Erro na solicitação: ${response.status}`);
        
        const tasks = await response.json();

        return(tasks);

    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
    }
}

//Função que adiciona/cria nova tarefa
const addTask = async (event) => {

  event.preventDefault(); //bloqueia o comportamento padrão de recarregar página

  const task = { title: inputTask.value }; //define o título da tarefa com o valor passado no inputTask

  //Realiza o post da nova tarefa no banco de dados
  await fetch("http://localhost:3333/tasks", {
    method: "post",
    headers: { "Content-Type": "application/json" }, //dados tratados como json
    body: JSON.stringify(task), //passa o objeto do body em forma de string
  });

  loadTasks(); //atualiza a página com as novas alterações
  inputTask.value = ""; //apaga o texto do inputTask
}

//Função que deleta/apaga tarefa de acordo com seu id
const deleteTask = async (id) => {

  //Realiza o delete da nova tarefa no banco de dados
  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: "delete",
  });

  loadTasks(); //atualiza a página com as novas alterações
}

//Função que atualiza a tarefa com as novas informações enviadas
const updateTask = async ({ id, title, created_at, status }) => {

  //Realiza o update(put) da nova tarefa no banco de dados
  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, status }), //como os nomes são os mesmos, não é preciso colocar: { title: title, status: status }
  });

  loadTasks(); //atualiza a página com as novas alterações
};

//Função que formata a data GMT para o formato UTC, local do usuário
const formatDate = (dateUTC) => {

    const options = { dateStyle: "long", timeStyle: "short" }; //define os estilos da data e tempo
    const date = new Date(dateUTC).toLocaleString("pt-br", options); //trasforma a data completa em horário local

    return date;
}

//Função que usa da document.createElement do javascript para criar elemento, passando tag e seu conteúdo por parâmetro
const createElement = (tag, innerText = "", innerHTML ="") => {

    const element = document.createElement(tag);

    if (innerText) 
        element.innerText = innerText;
    
    if (innerHTML) 
        element.innerHTML = innerHTML;
    
    return element;
}

//Função que cria o elemento select com suas options e passa um valor como parâmetro
const createSelect = (value) => {

    const options = `
                    <option value="pendente">Pendente</option>
                    <option value="em andamento">Em andamento</option>
                    <option value="concluida">Concluída</option>
                    `;
    const select = createElement("select", "", options);

    select.value = value; //o valor dependerá do evento "change" que o usuário realizará no momento de mudar a option do select
    
    return select;

}

//Função responsável por criar/montar a linha da task/tarefa com seus elementos html
const createRow = (task) => {
    
    const { id, title, created_at, status } = task;
    
    //Criação da linha da task
    const tr = createElement("tr");

    //Criaçao das 4 colunas
    const tdTitle = createElement("td", title);
    const tdCreatedAt = createElement("td", formatDate(created_at));
    const tdStatus = createElement("td");
    const tdActions = createElement("td");
    
    //Criação do select status, que alterará seu valor caso ocorra o "change" de option
    const select = createSelect(status);
    select.addEventListener("change", ({ target }) => updateTask({...task, status:target.value}));

    //Criação dos botões de edição e remoção
    const editButton = createElement("button", "", "<span class='material-symbols-outlined'>edit</span>");
    const deleteButton = createElement("button", "", "<span class='material-symbols-outlined'>delete</span>");

    //Criação do formulário e do campo de input que serão gerados quando o botão de edição for acionado
    const editForm = createElement("form");
    const editInput = createElement("input");

    editInput.value = title; // título prévio é apresentado no input gerado, para eventuais correções
    editForm.appendChild(editInput); // adição do input no formulário gerado

    //Assim que o evento "submit" for acionado, a tarefa é atualizada para o título inserido no editInput
    editForm.addEventListener("submit", (event) => {
        event.preventDefault();

        updateTask({ id, title: editInput.value, status});
    });

    //Quando o botão de edit é clicado, o campo de tdTitle com o título anterior é apagado, dando espaço para o formulário com o campo input, para edição
    editButton.addEventListener("click", () => {
        tdTitle.innerText = "";
        tdTitle.appendChild(editForm);
    })

    //Adiciona as classes aos botões
    editButton.classList.add("btn-action");
    deleteButton.classList.add("btn-action");
    
    //Quando o botão de delete for clicado para uma certa task, ativará a função deleteTask, que receberá o id da respectiva task 
    deleteButton.addEventListener("click", () => {deleteTask(id)} );

    tdStatus.appendChild(select); //adiciona o select gerado na coluna Status
    
    //Adiciona os botões criados na coluna Ações
    tdActions.appendChild(editButton);
    tdActions.appendChild(deleteButton);

    //Adiciona cada uma das 4 colunas na row da task que será criada
    tr.appendChild(tdTitle);
    tr.appendChild(tdCreatedAt);
    tr.appendChild(tdStatus);
    tr.appendChild(tdActions);

    return tr; //retorna a linha da task montada
}

//Função que percorre as 'tasks' do banco de dados, cria a linha de cada uma, mostrando-as na tela
const loadTasks = async () => {

    //Faz o fetch ao BD, retornando um array com as tasks
    const tasks = await fetchTasks();

    //Limpa a tabela antes de carregar a nova task, para evitar repetições
    tbody.innerHTML = "";

    //Percorre o array de tasks
    tasks.forEach( (task) => {
        const tr = createRow(task); //cria a linha de cada task
        tbody.appendChild(tr); //Mostra a tr criada no body/na tela
    })
}

addForm.addEventListener("submit", addTask); //Quando o formulário de adicionar tarefa for enviado, a função addTask é executada

loadTasks(); //Carrega as tasks presentes no banco de dados