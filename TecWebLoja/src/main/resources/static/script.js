console.log('Carreguei script da loja (CozyMart)');

document.addEventListener('DOMContentLoaded', () => {
    inicializarLoja();
});

function inicializarLoja() {
    // Botão opcional de recarregar (adicione <button id="reloadProductsBtn">Recarregar</button> se quiser)
    const reloadBtn = document.getElementById('reloadProductsBtn');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => carregarProdutosDaAPI(true));
    }

    carregarProdutosDaAPI(false);
}

// Busca produtos da API
async function carregarProdutosDaAPI(forcarLog) {
    const apiUrl = 'http://localhost:8080/loja/all';
    const container = document.getElementById('lista-de-produtos');

    if (!container) {
        console.error('Container #lista-de-produtos não encontrado. Verifique se você adicionou o bloco HTML.');
        return;
    }

    // Placeholder enquanto carrega
    container.innerHTML = '<div class="col-12 text-muted">Carregando produtos...</div>';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Falha na requisição: ${response.status} ${response.statusText}`);
        }

        // Evitar cache residual
        const textRaw = await response.text();
        let produtos;
        try {
            produtos = JSON.parse(textRaw);
        } catch (e) {
            console.error('Falha ao interpretar JSON:', e, 'Texto bruto:', textRaw);
            container.innerHTML = '<div class="col-12 text-danger">Erro ao interpretar resposta do servidor.</div>';
            return;
        }

        if (!Array.isArray(produtos)) {
            console.warn('Resposta não é array. Valor recebido:', produtos);
            container.innerHTML = '<div class="col-12 text-warning">Formato inesperado da resposta.</div>';
            return;
        }

        if (forcarLog || produtos.length === 0) {
            console.log(`Produtos recebidos (${produtos.length}):`, produtos);
        }

        renderizarProdutos(produtos, container);

    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        container.innerHTML = `<div class="col-12 text-danger">Não foi possível carregar produtos: ${error.message}</div>`;
    }
}

// Renderiza os cards
function renderizarProdutos(produtos, container) {
    container.innerHTML = ''; // limpa

    if (produtos.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted">Nenhum produto cadastrado ainda.</div>';
        return;
    }

    produtos.forEach(produto => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 mb-4';

        // Proteção caso algum campo venha undefined
        const nome = produto.name ?? '(Sem nome)';
        const categoria = produto.category ?? '(Sem categoria)';
        const preco = typeof produto.price === 'number' ? produto.price : parseFloat(produto.price);
        const precoFormatado = isNaN(preco) ? '—' : `R$ ${preco.toFixed(2).replace('.', ',')}`;

        col.innerHTML = `
            <div class="card product-card h-100">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ab?auto=format&fit=crop&w=600&q=60" 
                     class="card-img-top" alt="${nome}">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title">${escapeHtml(nome)}</h6>
                    <p class="small text-muted">${escapeHtml(categoria)}</p>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <div class="fw-bold fs-5 text-dark">${precoFormatado}</div>
                        <button class="btn btn-sm btn-outline-primary add-cart" data-product-title="${escapeHtml(nome)}">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });

    prepararBotoesCarrinho();
}

// Adiciona eventos aos botões de carrinho (inclusive novos)
function prepararBotoesCarrinho() {
    document.querySelectorAll('.add-cart').forEach(btn => {
        btn.onclick = e => {
            const button = e.currentTarget;
            const title = button.getAttribute('data-product-title') || 'Produto';

            button.classList.remove('btn-outline-primary');
            button.classList.add('btn-success');
            button.innerHTML = '<i class="fas fa-check"></i>';

            setTimeout(() => {
                button.classList.remove('btn-success');
                button.classList.add('btn-outline-primary');
                button.innerHTML = '<i class="fas fa-cart-plus"></i>';
            }, 1200);

            console.log('Adicionado ao carrinho:', title);
        };
    });
}

// Utilitário simples para evitar injeção HTML
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}