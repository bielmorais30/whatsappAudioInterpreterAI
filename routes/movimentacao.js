const express = require('express')
const router = express.Router()
const supabase = require('../services/db.js')
const {verMovimentacoes} = require('../services/movimentacao.js')

// CREATE - POST /movimentacao
router.post('/', async (req, res) => {
  const { id_usuario, fluxo, valor, forma_pagamento, data_mov, produto, categoria } = req.body
  const now = new Date();
  const { data, error } = await supabase.from('movimentacao').insert([{ id_usuario, fluxo, valor, forma_pagamento, data : data_mov, created_at : now, produto, categoria }])
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// READ - GET /movimentacao
router.get('/', async (req, res) => {
  const id_usuario  = req.query.idusuario;

  let retorno = await verMovimentacoes(id_usuario)

  if (!retorno.success) return res.status(500).json({ error: retorno.error });

  res.json(retorno.data);
});

// UPDATE - PUT /users/:id
// router.put('/:id', async (req, res) => {
//   const { nome, email } = req.body
//   const { data, error } = await supabase
//     .from('usuarios')
//     .update({ nome, email })
//     .eq('id', req.params.id)

//   if (error) return res.status(500).json({ error: error.message })
//   res.json(data)
// })

// // DELETE - DELETE /users/:id
// router.delete('/:id', async (req, res) => {
//   const { data, error } = await supabase
//     .from('usuarios')
//     .delete()
//     .eq('id', req.params.id)

//   if (error) return res.status(500).json({ error: error.message })
//     res.status(200).json({ msg: 'Deletado com sucesso!', data })
// })

module.exports = router
