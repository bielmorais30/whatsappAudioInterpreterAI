const supabase = require("./services/db.js") ;

async function testarConexao() {
    const { data, error } = await supabase.from('usuarios').select('*')
  
    if (error) {
      console.error('Erro ao conectar ou consultar:', error.message)
    } else {
      console.log('Dados recebidos:', data)
    }
  }
  
  testarConexao()