// Espera o DOM (a estrutura da página) carregar completamente
document.addEventListener("DOMContentLoaded", function() {

    console.log("DOM Carregado. Iniciando script do painel de administração.");

    // Constantes para referenciar os elementos do HTML
    const backendUrl = 'http://localhost:8080';
    const productForm = document.getElementById('productForm');
    const getAllProductsBtn = document.getElementById('getAllProductsBtn');
    const productTableBody = document.querySelector('#productTable tbody'); // Seletor corrigido
    const productIdField = document.getElementById('productIdField');
    const saveBtn = document.getElementById('saveBtn');

    // Verificação para garantir que os elementos essenciais foram encontrados
    if (!productForm || !productTableBody) {
        console.error("Erro crítico: O formulário de produto ou o corpo da tabela não foram encontrados no HTML.");
        return;
    }

    // Listener para o evento de 'submit' do formulário
    productForm.addEventListener('submit', function (event) {
        // Previne o comportamento padrão do formulário, que é recarregar a página
        event.preventDefault();

        // Pega os valores dos campos do formulário
        const productId = productIdField.value;
        const name = document.getElementById('name').value;
        const category = document.getElementById('category').value;
        const price = document.getElementById('price').value;
        const quantity = document.getElementById('quantity').value;
        const supplier = document.getElementById('supplier').value;
        const barcode = document.getElementById('barcode').value;

        // Se o campo 'productId' tiver um valor, significa que estamos editando um produto existente.
        // Se estiver vazio, é um produto novo.
        if (productId) {
            updateProduct(productId, name, category, price, quantity, supplier, barcode);
        } else {
            addProduct(name, category, price, quantity, supplier, barcode);
        }
    });

    // Listener para o botão de atualizar a lista manualmente
    getAllProductsBtn.addEventListener('click', fetchProducts);

    // --- FUNÇÕES DE COMUNICAÇÃO COM A API ---

    /**
     * Envia uma requisição POST para adicionar um novo produto.
     */
    function addProduct(name, category, price, quantity, supplier, barcode) {
        console.log(`Enviando requisição para adicionar produto: ${name}`);

        const params = new URLSearchParams({
            name, category, price, quantity, supplier, barCode: barcode
        });

        fetch(`${backendUrl}/loja/addProduct`, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params.toString(),
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // Exibe a resposta do servidor (ex: "Product Saved")
            productForm.reset(); // Limpa o formulário
            fetchProducts(); // Atualiza a tabela com o novo produto
        }).catch(error => {
            console.error('Erro ao adicionar produto:', error);
            alert('Falha ao adicionar o produto. Verifique o console para mais detalhes.');
        });
    }

    /**
     * Envia uma requisição PUT para atualizar um produto existente.
     */
    function updateProduct(productId, name, category, price, quantity, supplier, barcode) {
        console.log(`Enviando requisição para atualizar produto ID: ${productId}`);

        // CORREÇÃO: Constrói a URL de forma segura usando URLSearchParams.
        // Isso garante que a URL fique no formato: /update/1?name=Nome&category=Etc...
        const params = new URLSearchParams({
            name, category, price, quantity, supplier, barCode: barcode
        });

        fetch(`${backendUrl}/loja/update/${productId}?${params.toString()}`, {
            method: 'PUT'
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            productForm.reset(); // Limpa o formulário
            productIdField.value = ''; // Limpa o campo oculto do ID
            saveBtn.textContent = 'Adicionar Produto'; // Restaura o texto do botão
            fetchProducts(); // Atualiza a tabela
        }).catch(error => {
            console.error('Erro ao atualizar produto:', error);
            alert('Falha ao atualizar o produto. Verifique o console para mais detalhes.');
        });
    }

    /**
     * Envia uma requisição DELETE para remover um produto.
     */
    function deleteProduct(productId) {
        console.log(`Enviando requisição para deletar produto ID: ${productId}`);
        fetch(`${backendUrl}/loja/delete/${productId}`, {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            fetchProducts(); // Atualiza a tabela
        }).catch(error => {
            console.error('Erro ao deletar produto:', error);
            alert('Falha ao deletar o produto. Verifique o console para mais detalhes.');
        });
    }

    /**
     * Busca todos os produtos da API e os renderiza na tabela.
     */
    function fetchProducts() {
        console.log("Buscando lista de produtos...");
        fetch(`${backendUrl}/loja/all`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro de rede: ${response.statusText}`);
                }
                return response.json();
            })
            .then(products => {
                // Limpa o conteúdo atual da tabela
                productTableBody.innerHTML = '';

                // Para cada produto recebido, cria uma linha na tabela
                products.forEach(product => {
                    const row = document.createElement('tr');

                    // CORREÇÃO: Usar <td> para células de dados no corpo da tabela
                    row.innerHTML = `
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>${product.price}</td>
                        <td>${product.quantity}</td>
                        <td>${product.supplier}</td>
                        <td>${product.barcode}</td>
                        <td>
                            <button class="edit-btn">Editar</button>
                            <button class="delete-btn">Deletar</button>
                        </td>
                    `;

                    // Adiciona os eventos aos botões da linha recém-criada
                    const editButton = row.querySelector('.edit-btn');
                    editButton.onclick = () => {
                        // Preenche o formulário com os dados do produto para edição
                        productIdField.value = product.id;
                        document.getElementById('name').value = product.name;
                        document.getElementById('category').value = product.category;
                        document.getElementById('price').value = product.price;
                        document.getElementById('quantity').value = product.quantity;
                        document.getElementById('supplier').value = product.supplier;
                        document.getElementById('barcode').value = product.barcode;
                        saveBtn.textContent = 'Atualizar Produto'; // Muda o texto do botão
                    };

                    const deleteButton = row.querySelector('.delete-btn');
                    deleteButton.onclick = () => {
                        if (confirm(`Tem certeza que deseja deletar o produto "${product.name}"?`)) {
                            deleteProduct(product.id);
                        }
                    };

                    // Adiciona a linha completa à tabela
                    productTableBody.appendChild(row);
                });
                console.log(`${products.length} produtos carregados na tabela.`);
            })
            .catch(error => {
                console.error('Erro ao buscar produtos:', error);
                productTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:red;">${error.message}</td></tr>`;
            });
    }

    // --- EXECUÇÃO INICIAL ---
    // Carrega a lista de produtos assim que a página é aberta.
    fetchProducts();

});