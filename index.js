import express from "express"
import { Sequelize, DataTypes } from "sequelize";

const app = express();

app.use(express.json())

const sequelize = new Sequelize("senai", "root", "", { host: "localhost", dialect: "mysql" })

const Produto = sequelize.define('Produto', {
  nome: DataTypes.STRING,
  preco: DataTypes.DECIMAL(10, 2),
  quantidade: DataTypes.INTEGER
}, { tableName: 'produtos' })

app.get("/", (req, res) => {
  res.send('servido Express funcionando')
});

app.post("/usuario", (req, res) => {
  const nome = req.body.nome

  res.send("Usuário" + nome + " Cadastrado com sucesso!")
})

app.post("/produtos", async (req, res) => {
  const produto = {
    nome: req.body.nome,
    preco: req.body.preco,
    quantidade: req.body.quantidade
  }

  if (!produto.nome) {
    return res.status(400).json({
      mensagem: "Nome é obrigatório"
    })
  }

  try {
    const produtoCadastrado = await Produto.create(produto)
    res.status(201).json(produtoCadastrado)
  } catch (erro) {
    res.status(500).json({ mensagem: erro.message })
  }
})

app.get("/produtos", async (req, res) => {
  try {
    const produtos = await Produto.findAll()
    res.status(200).json(produtos)
  } catch (erro) {
    res.status(500).json({ mensagem: erro.message })
  }
})

app.get('/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id)

    if (!produto) {
      return res.status(404).json({ 'message': 'Produto não encontrado' })
    }

    res.status(200).json(produto)
  } catch (erro) {
    res.status(500).send('erro ao buscar produto')
  }

})

app.delete('/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id)

    if (!produto) {
      return res.status(404).send('Produto não encontrado')
    }

    await produto.destroy()
    res.status(204).send()
  } catch (erro) {
    res.status(500).send('erro ao excluir produto')
  }
})

app.put('/produtos/:id', async (req, res) => {
  const produtoAtualizado = {
    nome: req.body.nome,
    preco: req.body.preco,
    quantidade: req.body.quantidade
  }

  if (!produtoAtualizado.nome) {
    return res.status(400).json({
      mensagem: "Nome é obrigatório"
    })
  }

  try {
    const produto = await Produto.findByPk(req.params.id)

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }
    

    await produto.update(produtoAtualizado)
    res.status(200).json(produto)
  } catch (erro) {
    res.status(500).send('erro ao atualizar o produto')
  }
  
})


async function iniciar() {
  try {
    await sequelize.sync()
    app.listen(3000, () => {
      console.log("Servidor Express rodando em http://localhost:3000");
    });
  } catch (erro) {
    console.error(erro.message)
  }
}

iniciar()