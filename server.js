//Alunos: Samuel Guerra e Carlos Henrique

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

app.use(bodyParser.json());

// Veículos armazenados em um banco de dados simulado
let anunciosDeVeiculos = [
    { id: 1, nome: 'Fusca', fabricante: 'Volkswagen', ano: 1978, tipoCombustivel: 'Gasolina', cor: 'Azul', preco: 15000 },
    { id: 2, nome: 'Civic', fabricante: 'Honda', ano: 2022, tipoCombustivel: 'Gasolina', cor: 'Preto', preco: 120000 },
    { id: 3, nome: 'Gol', fabricante: 'Volkswagen', ano: 2015, tipoCombustivel: 'Álcool', cor: 'Branco', preco: 25000 },
    { id: 4, nome: 'Corolla', fabricante: 'Toyota', ano: 2020, tipoCombustivel: 'Gasolina', cor: 'Cinza', preco: 95000 },
    { id: 5, nome: 'Fiesta', fabricante: 'Ford', ano: 2010, tipoCombustivel: 'Flex', cor: 'Vermelho', preco: 30000 }
];

// Definindo o endpoint para a página principal
app.get('/', (req, res) => {
    const gerarHTML = () => {
        let htmlContent = `
        <html>
        <head>
            <title>Veículos para Venda</title>
        </head>
        <body>
            <h1>Bem-vindo à nossa Garagem Virtual!</h1>
            <p>Aqui você encontra os melhores veículos à venda.</p>
            <ul>`;
        
        // Criando o conteúdo dinâmico da lista de veículos
        anunciosDeVeiculos.forEach(veiculo => {
            htmlContent += `
            <li>
                <strong>${veiculo.nome}</strong> - ${veiculo.fabricante} (${veiculo.ano})<br>
                Combustível: ${veiculo.tipoCombustivel}<br>
                Cor: ${veiculo.cor}<br>
                Preço: R$ ${veiculo.preco.toLocaleString('pt-BR')}<br>
            </li>`;
        });

        htmlContent += `
            </ul>
            <footer>
                <p>Endereço da garagem: Av. das Carros, 123</p>
                <p>Venha conferir os veículos disponíveis!</p>
            </footer>
        </body>
        </html>
        `;
        return htmlContent;
    };

    // Enviando a página gerada
    res.status(200).send(gerarHTML());
});

// Rota para adicionar um novo veículo
app.post('/veiculo', (req, res) => {
    const veiculo = req.body;

    if (!veiculo.nome || !veiculo.fabricante || !veiculo.ano || !veiculo.tipoCombustivel || !veiculo.cor || !veiculo.preco) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios para cadastrar um veículo.' });
    }

    const novoVeiculo = {
        id: anunciosDeVeiculos.length + 1, 
        ...veiculo  // Copia todos os dados do objeto enviado
    };

    anunciosDeVeiculos.push(novoVeiculo);

    res.status(201).json(novoVeiculo);
});

// Rota para atualizar o preço de um veículo existente
app.put('/veiculo', (req, res) => {
    const { id, preco } = req.body;

    if (!id || !preco) {
        return res.status(400).json({ erro: 'ID e preço são obrigatórios para atualizar o veículo.' });
    }

    const veiculoExistente = anunciosDeVeiculos.find(veiculo => veiculo.id === id);

    if (!veiculoExistente) {
        return res.status(404).json({ erro: `Veículo com ID ${id} não encontrado.` });
    }

    veiculoExistente.preco = preco;

    res.status(200).json({
        sucesso: `O preço do veículo de ID ${id} foi alterado para R$ ${preco.toLocaleString('pt-BR')}.`
    });
});

// Rota para excluir um veículo
app.delete('/veiculo/:id', (req, res) => {
    const { id } = req.params;

    const indexVeiculo = anunciosDeVeiculos.findIndex(veiculo => veiculo.id === parseInt(id));

    if (indexVeiculo === -1) {
        return res.status(404).json({ erro: `Veículo com ID ${id} não encontrado.` });
    }

    anunciosDeVeiculos.splice(indexVeiculo, 1);

    res.status(202).json({ sucesso: `Veículo de ID ${id} foi removido com sucesso.` });
});

// Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://127.0.0.1:${port}`);
});
