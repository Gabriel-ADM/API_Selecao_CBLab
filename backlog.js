let liTarefas = [];
let inputTarefa = document.getElementById("inputTarefa");
let t = true
let f = false
inputTarefa.addEventListener('keypress', (tecla) => {
    if (tecla.keyCode == 13) {
        addTarefa()
    };
});

let div = document.getElementById("tarefas")
let button = document.getElementById("remvButton")

if (localStorage.getItem("liTarefas") !== null) {
    liTarefas = localStorage.getItem("liTarefas")
    liTarefas = liTarefas.split(",")
    for (i in liTarefas) {
        tarefa = document.createElement("h4")
        tarefa.innerHTML = `${Number(i) + 1}. ${liTarefas[i]}.<input type="checkbox" class="checkbox"> `
        tarefa.id = i
        div.appendChild(tarefa)
    }
}
let addTarefa = function () {
    if (inputTarefa.value !== '') {
        tarefa = document.createElement("h4")
        let txt = inputTarefa.value
        liTarefas.push(txt)
        for (i in liTarefas) {
            tarefa.innerHTML = `${Number(i) + 1}. ${liTarefas[i]}.<input type="checkbox" class="checkbox">`
            tarefa.id = i
        }
        div.appendChild(tarefa)
        localStorage.setItem("liTarefas", liTarefas)
    } else {
        alert('Tarefa não preenchida.')

    }
    inputTarefa.value = ""
}
inputTarefa.focus()

let todos = document.getElementById("todos")
let checkboxes = document.getElementsByClassName("checkbox")
let selectAll = function () {
    for (i = 0; i < checkboxes.length; i++) {
        if (todos.checked == t) {
            checkboxes[i].checked = t
        } else if (todos.checked == f) {
            checkboxes[i].checked = f
        }
    }
}

let h4 = document.getElementsByTagName("h4")
let remvTarefa = function () {
    for (i = 0; i < checkboxes.length; i++) {
        if (todos.checked == t) {
            localStorage.removeItem("liTarefas")
            location.reload()
        } else if (checkboxes[i].checked == t) {
            liTarefas.splice(i, 1)
            liTarefas = localStorage.setItem("liTarefas", liTarefas)
            location.reload()
        }
    }
}