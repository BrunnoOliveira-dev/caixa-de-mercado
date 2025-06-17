document.addEventListener("DOMContentLoaded", () => {
    const totalElement = document.getElementById("total-amount");
    const valorPagoInput = document.getElementById("amount-paid");
    const trocoElement = document.getElementById("change-amount");
    const checkoutButton = document.getElementById("checkout-button");
    const paymentStatus = document.getElementById("payment-status");
    const paymentMethod = document.getElementById("payment-method");

    if (!totalElement || !valorPagoInput || !trocoElement) {
        console.error("Um ou mais elementos necessários não foram encontrados no DOM.");
        return;
    }

    function calcularTroco() {
        const total = parseFloat(totalElement.textContent);
        const valorPago = parseFloat(valorPagoInput.value);

        if (isNaN(valorPago) || valorPago < total) {
            trocoElement.textContent = "0.00";
            return;
        }

        const troco = valorPago - total;
        trocoElement.textContent = troco.toFixed(2);
    }

    // Adicionar evento para calcular o troco ao alterar o valor pago
    valorPagoInput.addEventListener("input", calcularTroco);

    if (checkoutButton) {
        checkoutButton.addEventListener("click", finalizarCompra);
    }

    function finalizarCompra() {
        console.log("[LOG] Iniciando finalização da compra");
        const total = parseFloat(document.getElementById("total-amount").textContent);
        const valorPago = parseFloat(document.getElementById("amount-paid").value);
        const carrinho = document.getElementById("cart-list");
        const itens = carrinho.querySelectorAll(".cart-item");
        const metodo = paymentMethod.value;

        console.log("[LOG] Itens no carrinho:", Array.from(itens).map(i => i.querySelector('.item-name').textContent));
        console.log("[LOG] Total:", total, "Valor Pago:", valorPago, "Método:", metodo);

        if (itens.length === 0) {
            console.warn("[LOG] Tentativa de finalizar sem itens no carrinho");
            mostrarStatus("Adicione produtos ao carrinho antes de finalizar a compra.", false);
            return;
        }
        if (isNaN(valorPago) || valorPago < total) {
            console.warn("[LOG] Valor pago insuficiente");
            mostrarStatus("Valor pago insuficiente.", false);
            return;
        }

        // Monta os dados da venda no formato esperado pelo backend
        const produtos = Array.from(itens).flatMap(item => {
            const produtoId = item.dataset.produtoId;
            const quantidade = parseInt(item.querySelector("input[type='number']").value);
            // Repete o produto conforme a quantidade
            return Array(quantidade).fill({ produto_id: produtoId });
        });
        const venda = {
            produtos,
            cliente: null, // ajuste se houver seleção de cliente
            caixa: localStorage.getItem('id'),   // ajuste se houver seleção de caixa
            formaPagamento: metodo,
            total,
            dataHora: new Date().toISOString(),
            observacoes: ""
        };

        console.log("[LOG] Dados enviados para API:", venda);

        // Recupera o token salvo após o login
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Usuário não autenticado! Faça login novamente.');
            window.location.href = '/login';
            return;
        }

        // Envia para a API (ajuste a URL conforme seu backend)
        fetch("http://localhost:8080/api/vendas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(venda)
        })
        .then(res => {
            if (res.ok) {
                console.log("[LOG] Venda finalizada com sucesso!");
                mostrarStatus("Pagamento realizado com sucesso!", true);
                carrinho.innerHTML = "";
                document.getElementById("total-amount").textContent = "0.00";
                document.getElementById("amount-paid").value = "";
                document.getElementById("change-amount").textContent = "0.00";
            } else {
                return res.text().then(msg => { 
                    console.error("[LOG] Erro ao finalizar venda:", msg);
                    throw new Error(msg); 
                });
            }
        })
        .catch(err => {
            console.error("[LOG] Erro na requisição de venda:", err);
            mostrarStatus("Erro ao finalizar venda: " + err.message, false);
        });
    }

    function mostrarStatus(msg, sucesso) {
        paymentStatus.textContent = msg;
        paymentStatus.classList.remove("d-none", "alert-success", "alert-danger");
        paymentStatus.classList.add(sucesso ? "alert-success" : "alert-danger");
    }
});

function adicionarAoCarrinho(produto) {
    const carrinho = document.getElementById("cart-list");

    // Verificar se o produto já está no carrinho
    const itensCarrinho = carrinho.querySelectorAll(".cart-item");
    for (const item of itensCarrinho) {
        const nomeProduto = item.querySelector(".item-name").textContent;
        if (nomeProduto === produto.nome) {
            // Produto já está no carrinho, aumentar a quantidade
            const quantidadeInput = item.querySelector("input[type='number']");
            quantidadeInput.value = parseInt(quantidadeInput.value) + 1;
            atualizarTotal();
            return;
        }
    }

    // Criar um item de lista para o produto
    const item = document.createElement("li");
    item.className = "cart-item list-group-item d-flex justify-content-between align-items-center";
    // Salva o id do produto no dataset do item
    item.dataset.produtoId = produto.id || produto.produto_id;

    // Informações do produto dispostas em linha
    const info = document.createElement("div");
    info.className = "d-flex flex-row align-items-center";
    info.innerHTML = `
        <span class="item-name fw-bold me-3">${produto.nome}</span>
        <span class="item-brand text-muted me-3">Marca: ${produto.marca}</span>
        <span class="item-price me-3">Preço Unitário: R$ ${produto.precoUnitario.toFixed(2)}</span>
    `;

    // Controles de quantidade e remoção
    const controls = document.createElement("div");
    controls.className = "d-flex align-items-center";
    controls.innerHTML = `
        <input type="number" class="form-control form-control-sm me-2" value="1" min="1" max="${produto.quantidadeEstoque}" style="width: 60px;">
        <button class="remove-item btn btn-danger btn-sm">Remover</button>
    `;

    // Adicionar evento para remover o item
    controls.querySelector(".remove-item").addEventListener("click", () => {
        item.remove();
        atualizarTotal();
    });

    // Adicionar evento para atualizar o total ao alterar a quantidade
    controls.querySelector("input[type='number']").addEventListener("input", () => {
        atualizarTotal();
    });

    // Adicionar informações e controles ao item
    item.appendChild(info);
    item.appendChild(controls);

    // Adicionar o item ao carrinho
    carrinho.appendChild(item);

    // Atualizar o total
    atualizarTotal();
}

function atualizarTotal() {
    const carrinho = document.getElementById("cart-list");
    const totalElement = document.getElementById("total-amount");
    let total = 0;

    // Calcular o total com base nos itens do carrinho
    carrinho.querySelectorAll(".cart-item").forEach(item => {
        const quantidade = parseInt(item.querySelector("input[type='number']").value);
        const preco = parseFloat(item.querySelector(".item-price").textContent.replace("Preço Unitário: R$ ", ""));
        total += preco * quantidade;
    });

    // Atualizar o total no HTML
    totalElement.textContent = total.toFixed(2);
}

function procurarProduto() {
    const codigoProduto = document.getElementById("product-code").value;

    if (codigoProduto === "") {
        alert("Por favor, insira um código de produto.");
        return;
    }

    // Recupera o token salvo após o login
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Usuário não autenticado! Faça login novamente.');
        window.location.href = '/login';
        return;
    }

    fetch(`http://localhost:8080/api/produtos/barras/${codigoProduto}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Produto não encontrado.");
            }
            return response.json();
        })
        .then(data => {
            console.log("[LOG] Produto retornado da API:", data);
            if (!data || !data.nome || !data.precoUnitario) {
                throw new Error("Informações do produto estão incompletas.");
            }
            if (!data.id && !data.produto_id) {
                alert("Produto retornado sem ID. Não é possível adicionar ao carrinho.");
                return;
            }
            // Adicionar o produto ao carrinho
            adicionarAoCarrinho(data);
        })
        .catch(error => {
            alert(error.message);
        });
}

function limparBuscaProduto() {
    document.getElementById("product-code").value = "";
    atualizarTotal();
}

const tipoUsuario = localStorage.getItem('userType'); // ou sessionStorage
if (tipoUsuario !== 'GERENTE' && tipoUsuario !== 'CAIXA') {
    alert('Acesso restrito! você não tem altorização para acessar esta página.');
    window.location.href = '/'; // ou outra página
}