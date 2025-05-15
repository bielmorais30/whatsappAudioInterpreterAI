const express = require('express')
const router = express.Router()
const supabase = require('../services/db.js')

// CREATE - POST /users
router.post('/', async (req, res) => {
  try {
    const { nome, email, celular, senha } = req.body;

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nome, email, celular, senha }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data); // Use 201 Created
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// READ - GET /users
router.get('/', async (req, res) => {
  const id  = req.query.id;

  let query = supabase.from('usuarios').select('*');

  if (id) {
    query = query.eq('id', id).single(); // .single() espera só um resultado
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

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
