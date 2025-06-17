// Função principal para cadastro ou atualização de produto
async function cadastrarOuAtualizarProduto(produto) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Usuário não autenticado! Faça login novamente.');
        window.location.href = '/login';
        return;
    }
    let produtoExistente = null;
    try {
        const res = await fetch(`http://localhost:8080/api/produtos/barras/${produto.codigoBarras}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            produtoExistente = await res.json();
        }
    } catch (e) {}

    if (produtoExistente) {
        // Produto já existe: mostra modal para atualizar estoque
        if (confirm(`Produto já cadastrado!\nNome: ${produtoExistente.nome}\nMarca: ${produtoExistente.marca}\nEstoque atual: ${produtoExistente.quantidadeEstoque}\n\nDeseja acrescentar ao estoque?`)) {
            const quantidadeParaAdicionar = produto.quantidadeEstoque;
            await atualizarEstoqueProduto(produtoExistente.produto_id, quantidadeParaAdicionar);
        } else {
            mensagemStatus.textContent = 'Cadastro cancelado pelo usuário.';
            mensagemStatus.classList.add('alert-danger');
            mensagemStatus.classList.remove('d-none');
        }
    } else {
        await cadastrarProduto(produto);
    }
}

// Função para cadastrar novo produto
async function cadastrarProduto(produto) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8080/api/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(produto)
        });
        if (response.ok) {
            mensagemStatus.textContent = 'Produto cadastrado com sucesso!';
            mensagemStatus.classList.add('alert-success');
            form.reset();
        } else {
            const erro = await response.text();
            mensagemStatus.textContent = 'Erro ao cadastrar produto: ' + erro;
            mensagemStatus.classList.add('alert-danger');
        }
    } catch (err) {
        mensagemStatus.textContent = 'Erro de conexão com o servidor.';
        mensagemStatus.classList.add('alert-danger');
    }
    mensagemStatus.classList.remove('d-none');
}

// Atualiza apenas o estoque do produto existente
async function atualizarEstoqueProduto(produto_id, quantidadeParaAdicionar) {
    const token = localStorage.getItem('token');
    try {
        // Buscar produto atual
        const responseGet = await fetch(`http://localhost:8080/api/produtos/${produto_id}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!responseGet.ok) throw new Error('Produto não encontrado para atualização.');
        const produto = await responseGet.json();
        // Incrementa o estoque
        const novoEstoque = (produto.quantidadeEstoque || 0) + quantidadeParaAdicionar;
        const responsePut = await fetch(`http://localhost:8080/api/produtos/${produto_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ...produto, quantidadeEstoque: novoEstoque })
        });
        if (responsePut.ok) {
            mensagemStatus.textContent = 'Estoque atualizado com sucesso!';
            mensagemStatus.classList.add('alert-success');
            form.reset();
        } else {
            const erro = await responsePut.text();
            mensagemStatus.textContent = 'Erro ao atualizar estoque: ' + erro;
            mensagemStatus.classList.add('alert-danger');
        }
    } catch (err) {
        mensagemStatus.textContent = 'Erro ao atualizar estoque: ' + err.message;
        mensagemStatus.classList.add('alert-danger');
    }
    mensagemStatus.classList.remove('d-none');
}

const form = document.getElementById('estoque-form');
const mensagemStatus = document.getElementById('mensagem-status');

// Substitui o submit padrão para usar o fluxo inteligente
if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        mensagemStatus.classList.add('d-none');
        mensagemStatus.classList.remove('alert-success', 'alert-danger');
        const produto = {
            codigoBarras: document.getElementById('codigo-barras').value,
            nome: document.getElementById('nome-produto').value,
            marca: document.getElementById('marca-produto').value,
            precoUnitario: parseFloat(document.getElementById('preco-unitario').value),
            quantidadeEstoque: parseInt(document.getElementById('quantidade-estoque').value)
        };
        await cadastrarOuAtualizarProduto(produto);
    });
}

const tipoUsuario = localStorage.getItem('userType'); // ou sessionStorage
if (tipoUsuario !== 'GERENTE' && tipoUsuario !== 'ESTOQUISTA') {
    alert('Acesso restrito! você não tem altorização para acessar esta página.');
    window.location.href = '/'; // ou outra página
}

// Alternância de formulários e lógica de edição de produto existente
const btnNovoProduto = document.getElementById('btn-novo-produto');
const btnProdutoExistente = document.getElementById('btn-produto-existente');
const formNovo = document.getElementById('estoque-form');
const formEditar = document.getElementById('form-editar-produto');
const mensagemStatusEditar = document.getElementById('mensagem-status-editar');
const camposEditarProduto = document.getElementById('campos-editar-produto');

if (btnNovoProduto && btnProdutoExistente && formNovo && formEditar) {
    btnNovoProduto.addEventListener('click', () => {
        formNovo.classList.remove('d-none');
        formEditar.classList.add('d-none');
        mensagemStatus.classList.add('d-none');
        mensagemStatusEditar.classList.add('d-none');
        formNovo.reset();
    });
    btnProdutoExistente.addEventListener('click', () => {
        formNovo.classList.add('d-none');
        formEditar.classList.remove('d-none');
        mensagemStatus.classList.add('d-none');
        mensagemStatusEditar.classList.add('d-none');
        formEditar.reset();
        camposEditarProduto.classList.add('d-none');
    });
}

// Buscar produto existente por código de barras
const btnBuscarProduto = document.getElementById('btn-buscar-produto');
const inputCodigoEditar = document.getElementById('codigo-barras-editar');
if (btnBuscarProduto && inputCodigoEditar) {
    btnBuscarProduto.addEventListener('click', buscarProdutoParaEditar);
    inputCodigoEditar.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            buscarProdutoParaEditar();
        }
    });
}

async function buscarProdutoParaEditar() {
    mensagemStatusEditar.classList.add('d-none');
    mensagemStatusEditar.classList.remove('alert-success', 'alert-danger');
    camposEditarProduto.classList.add('d-none');
    const codigo = inputCodigoEditar.value.trim();
    if (!codigo) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`http://localhost:8080/api/produtos/barras/${codigo}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const produto = await res.json();
            document.getElementById('nome-produto-editar').value = produto.nome;
            document.getElementById('marca-produto-editar').value = produto.marca;
            document.getElementById('preco-unitario-editar').value = produto.precoUnitario;
            document.getElementById('quantidade-estoque-editar').value = produto.quantidadeEstoque;
            camposEditarProduto.classList.remove('d-none');
            mensagemStatusEditar.textContent = '';
        } else {
            mensagemStatusEditar.textContent = 'Produto não encontrado.';
            mensagemStatusEditar.classList.add('alert-danger');
            mensagemStatusEditar.classList.remove('d-none');
        }
    } catch (err) {
        mensagemStatusEditar.textContent = 'Erro ao buscar produto.';
        mensagemStatusEditar.classList.add('alert-danger');
        mensagemStatusEditar.classList.remove('d-none');
    }
}

// Submeter edição de produto existente
if (formEditar) {
    formEditar.addEventListener('submit', async function(e) {
        e.preventDefault();
        mensagemStatusEditar.classList.add('d-none');
        mensagemStatusEditar.classList.remove('alert-success', 'alert-danger');
        const codigo = inputCodigoEditar.value.trim();
        const token = localStorage.getItem('token');
        try {
            // Buscar produto para pegar o ID
            const res = await fetch(`http://localhost:8080/api/produtos/barras/${codigo}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Produto não encontrado para atualizar.');
            const produto = await res.json();
            // Montar objeto atualizado
            const produtoAtualizado = {
                ...produto,
                nome: document.getElementById('nome-produto-editar').value,
                marca: document.getElementById('marca-produto-editar').value,
                precoUnitario: parseFloat(document.getElementById('preco-unitario-editar').value),
                quantidadeEstoque: parseInt(document.getElementById('quantidade-estoque-editar').value)
            };
            // PUT para atualizar
            const putRes = await fetch(`http://localhost:8080/api/produtos/${produto.produto_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(produtoAtualizado)
            });
            if (putRes.ok) {
                mensagemStatusEditar.textContent = 'Produto atualizado com sucesso!';
                mensagemStatusEditar.classList.add('alert-success');
                formEditar.reset();
                camposEditarProduto.classList.add('d-none');
            } else {
                const erro = await putRes.text();
                mensagemStatusEditar.textContent = 'Erro ao atualizar produto: ' + erro;
                mensagemStatusEditar.classList.add('alert-danger');
            }
        } catch (err) {
            mensagemStatusEditar.textContent = 'Erro ao atualizar produto: ' + err.message;
            mensagemStatusEditar.classList.add('alert-danger');
        }
        mensagemStatusEditar.classList.remove('d-none');
    });
}