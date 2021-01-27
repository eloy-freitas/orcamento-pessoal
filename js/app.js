class Depesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            } else {
                return true
            }
        }
    }
}

class BD {
    constructor() {
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(despesa) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(despesa))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        let despesas = Array()
        let id = localStorage.getItem('id')
        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))
            if (despesa !== null) {
                despesa.id = i
                despesas.push(despesa)
            }
        }
        return despesas
    }

    pesquisar(despesa) {
        let despesas = Array()
        despesas = this.recuperarTodosRegistros()

        if (despesa.ano != '') {
            despesas = despesas.filter(d => d.ano == despesa.ano)
        }

        if (despesa.mes != '') {
            despesas = despesas.filter(d => d.mes == despesa.mes)
        }

        if (despesa.dia != '') {
            despesas = despesas.filter(d => d.dia == despesa.dia)
        }

        if (despesa.tipo != '') {
            despesas = despesas.filter(d => d.tipo == despesa.tipo)
        }

        if (despesa.tipo != '') {
            despesas = despesas.filter(d => d.descricao == despesa.descricao)
        }

        if (despesa.tipo != '') {
            despesas = despesas.filter(d => d.valor == despesa.valor)
        }

        console.log(despesas)
        return despesas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new BD()

function modificaModal(tipoMensagem) {
    let titulo = document.getElementById('modalTitulo')
    let mensagem = document.getElementById('modalMensagem')
    let botao = document.getElementById('modalBotao')

    if (tipoMensagem === 'sucesso') {

        titulo.innerHTML = 'Operação executada com sucesso!!!'
        titulo.className = 'modal-title text-success'

        mensagem.innerHTML = 'Despesa foi cadastrada com sucesso!'

        botao.innerHTML = 'Voltar'
        botao.className = 'btn btn-success'

    } else if (tipoMensagem === 'erro') {
        titulo.innerHTML = 'Falha na execução!!!'
        titulo.className = 'modal-title text-danger'

        mensagem.innerHTML = 'Campos obrigatórios não foram preenchidos'

        botao.innerHTML = 'Voltar'
        botao.className = 'btn btn-danger'
    }
    $('#modalRegistroDespesa').modal('show')
}


function limparTela() {
    document.getElementById('ano').value = ''
    document.getElementById('mes').value = ''
    document.getElementById('dia').value = ''
    document.getElementById('tipo').value = ''
    document.getElementById('valor').value = ''
    document.getElementById('descricao').value = ''

}


function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Depesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
    if (despesa.validarDados()) {
        bd.gravar(despesa)
        modificaModal('sucesso')
    } else {
        modificaModal('erro')
    }
    limparTela()

}

function carregaListaDespesa(despesas = Array(), filtro = false) {
   
    if (despesas.length == 0) {
        despesas = bd.recuperarTodosRegistros()
    }
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
    despesas.forEach(function (despesa) {
        let linha = listaDespesas.insertRow()
        linha.insertCell(0).innerHTML = `${despesa.dia}/${despesa.mes}/${despesa.ano}`
        switch (parseInt(despesa.tipo)) {
            case 1: despesa.tipo = 'Alimentação'
                break
            case 2: despesa.tipo = 'Educação'
                break
            case 3: despesa.tipo = 'Lazer'
                break
            case 4: despesa.tipo = 'Saúde'
                break
            case 5: despesa.tipo = 'Transporte'
        }
        linha.insertCell(1).innerHTML = despesa.tipo
        linha.insertCell(2).innerHTML = despesa.descricao
        linha.insertCell(3).innerHTML = despesa.valor
        let btn = document.createElement("button")
        btn.id = `id_despesa_${despesa.id}`
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_','')
            bd.remover(id)
            carregaListaDespesa()
        }
        linha.insertCell(4).append(btn)
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Depesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
    console.log(despesa)
    let despesas = bd.pesquisar(despesa)
    carregaListaDespesa(despesas, true)
    
}

