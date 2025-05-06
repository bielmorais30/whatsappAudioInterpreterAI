const express = require('express')
const app = express()
const usersRoutes = require('./routes/users')

app.use(express.json())
app.use('/users', usersRoutes)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
