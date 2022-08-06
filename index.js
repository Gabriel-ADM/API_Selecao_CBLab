//Variáveis utilizadas
let lPedidos = []
let nextID
let editID = null
let clientName
let productName
let productValue
let productStatus
let timeStamp
let sent
let newPedido
let i

//Constantes utilizadas
const tableBody = document.querySelector('#tableBody')
const clientNameInput = document.querySelector('#clientName')
const productNameInput = document.querySelector('#productName')
const productValueInput = document.querySelector('#productValue')
const productStatusInput = document.querySelector('#productStatus')

//Função responsavel por traduzir o estado do pedido
function translateStatus(status) {
    if (status == 'RECEIVED') {
        status = 'Recebido'
    } else if (status == 'CONFIRMED') {
        status = 'Confirmado'
    } else if (status == 'DISPATCHED') {
        status = 'Despachado'
    } else if (status == 'DELIVERED') {
        status = 'Entregue'
    } else {
        status = 'Cancelado'
    }
    return status
}

//Função que retorna o input de Estado do pedido para formato original
function resetOptions() {
    document.getElementById('receivedInputOption').style.display = "block"
    document.getElementById('confirmedInputOption').style.display = "block"
    document.getElementById('dispatchedInputOption').style.display = "block"
    document.getElementById('confirmedInputOption').style.display = "block"
}

// Função impressora de pedidos
const printData = (lPedidos) => {
    for (i = 0; i < lPedidos.length; i++) {
        row = tableBody.insertRow(i)

        cellID = row.insertCell(0)
        cellID.innerHTML = lPedidos[i].id

        cellClient = row.insertCell(1)
        cellClient.className = 'textLeft'
        cellClient.innerHTML = lPedidos[i].cliente

        cellProduct = row.insertCell(2)
        cellProduct.className = 'textLeft'
        cellProduct.innerHTML = lPedidos[i].produto

        cellValue = row.insertCell(3)
        cellValue.innerHTML = `R$ ${lPedidos[i].valor}.00`

        cellStatus = row.insertCell(4)
        cellStatus.innerHTML = translateStatus(lPedidos[i].estado)

        cellImgs = row.insertCell(5)
        cellImgs.innerHTML = `<img onclick="editPedido(${lPedidos[i].id})" src="img/edit.png"> <img src="img/delete.png" onclick="deletePedido(${lPedidos[i].id})"></img>`
    }
}


//Função responsavel pela limpeza da tabela html
function clearTable() {
    tableBody.innerHTML = ''
}

//Função que chama o arquivo JSON
const fetchPedidos = async (pedidos) => {
    const packageResponse = await fetch("pedidos.json")
    const data = await packageResponse.json()

    return data
}

//Função que busca o array e chama a função impressora
const getPedido = async (pedidos) => {
    const data = await fetchPedidos(pedidos)
    lPedidos = data.pedidos

    lPedidos = lPedidos.filter((content) => {
        return content != null
    })

    nextID = data.nextId

    printData(lPedidos)
}
getPedido()

// Função que limpa os inputs
function cancelInput() {
    if (confirm('Deseja cancelar alterações?')) {
        clientNameInput.value = ''
        productNameInput.value = ''
        productValueInput.value = ''
        productStatusInput.value = ''
    }
}

//Função que le os inputs
function getInputData() {
    let msg = ''
    clientName = clientNameInput.value
    productName = productNameInput.value
    productValue = productValueInput.value
    productStatus = productStatusInput.value

    clientName == '' ? msg += 'Insira nome do cliente\n' : clientName = clientNameInput.value
    productName == '' ? msg += 'Insira produto do pedido\n' : productName = productNameInput.value
    productValue == '' ? msg += 'Insira valor do pedido\n' : productValue = productValueInput.value
    productStatus == '' ? msg += 'Insira estado do pedido\n' : productStatus = productStatusInput.value

    if (msg != '') {
        alert(msg)
    } else {
        clientNameInput.value = ''
        productNameInput.value = ''
        productValueInput.value = ''
        productStatusInput.value = ''
        productStatus == 'DELIVERED' ? sent = true : sent = false
        timeStamp = new Date().toISOString()
    }
}

//Função responsável por modificar ou adicionar itens na lista de pedidos
function saveInput() {
    if (confirm('Deseja salvar o pedido?')) {
        getInputData()

        if (editID != null) {
            newPedido = {
                "id": editID,
                "cliente": clientName,
                "produto": productName,
                "valor": productValue,
                "entregue": sent,
                "estado": productStatus,
                "timestamp": timeStamp
            }
            for (i = 0; i < lPedidos.length; i++) {
                if (lPedidos[i].id == editID) {
                    lPedidos.splice(i, 1, newPedido)
                }
            }
            editID = null
        } else {
            newPedido = {
                "id": nextID,
                "cliente": clientName,
                "produto": productName,
                "valor": productValue,
                "entregue": sent,
                "estado": productStatus,
                "timestamp": timeStamp
            }
            nextID++
            lPedidos.push(newPedido)
        }

        resetOptions()
        clearTable()
        printData(lPedidos)
    }

}

//Função responsável por deletar pedidos
function deletePedido(id) {
    if (confirm(`Deseja excluir pedido com ID: ${id}?`)) {
        for (i = 0; i < lPedidos.length; i++) {
            if (lPedidos[i].id == id) {
                lPedidos.splice(i, 1)
            }
        }

        clearTable()
        printData(lPedidos)
    }
}


function editPedido(id) {
    for (i = 0; i < lPedidos.length; i++) {
        if (lPedidos[i].id == id) {
            editID = id
            clientNameInput.value = lPedidos[i].cliente
            productNameInput.value = lPedidos[i].produto
            productValueInput.value = lPedidos[i].valor
            productStatusInput.value = lPedidos[i].estado

            if (productStatusInput.value == 'CONFIRMED') {
                document.getElementById('receivedInputOption').style.display = "none"
            } else if (productStatusInput.value == 'DISPATCHED') {
                document.getElementById('receivedInputOption').style.display = "none"
                document.getElementById('confirmedInputOption').style.display = "none"
            } else if (productStatusInput.value == 'DELIVERED') {
                document.getElementById('receivedInputOption').style.display = "none"
                document.getElementById('confirmedInputOption').style.display = "none"
                document.getElementById('dispatchedInputOption').style.display = "none"
                document.getElementById('canceledInputOption').style.display = "none"
            } else if (productStatusInput.value == 'CANCELED') {
                document.getElementById('receivedInputOption').style.display = "none"
                document.getElementById('confirmedInputOption').style.display = "none"
                document.getElementById('dispatchedInputOption').style.display = "none"
                document.getElementById('deliveredInputOption').style.display = "none"
            }

            window.scrollTo({
                top: 100,
                behavior: 'smooth',
            })
            console.log(editID)
        }
    }
}