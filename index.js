const express = require('express')
const app = express()
const usersRoutes = require('./routes/users')
require('dotenv').config();

require('./botWhatsapp');

app.use(express.json())
app.use('/users', usersRoutes)

// const PORT = 3000
const port = process.env.PORT || 4000 
app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})
