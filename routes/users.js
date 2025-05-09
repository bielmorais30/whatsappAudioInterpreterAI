const express = require('express')
const router = express.Router()
const supabase = require('../db.js')

// CREATE - POST /users
router.post('/', async (req, res) => {
  const { nome, email } = req.body
  const { data, error } = await supabase.from('usuarios').insert([{ nome, email }])
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// READ - GET /users
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('usuarios').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// UPDATE - PUT /users/:id
router.put('/:id', async (req, res) => {
  const { nome, email } = req.body
  const { data, error } = await supabase
    .from('usuarios')
    .update({ nome, email })
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE - DELETE /users/:id
router.delete('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })
    res.status(200).json({ msg: 'Deletado com sucesso!', data })
})

module.exports = router
