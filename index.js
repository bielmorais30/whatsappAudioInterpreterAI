const express = require('express')
const app = express()
const usersRoutes = require('./routes/users')
const movimentacaoRoutes = require('./routes/movimentacao')
const cors = require('cors');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // ou domínio específico
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // responde a preflight
  }

  next();
});

require('dotenv').config();

require('./botWhatsapp');

app.use(express.json())
app.use('/users', usersRoutes)
app.use('/movimentacao', movimentacaoRoutes)

// const PORT = 3000
const port = process.env.PORT || 4000 
app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})
