const supabase = require('./db.js');

async function adicionarUsuario(dados) {
    const { nome, email } = dados;
    const { data, error } = await supabase.from('usuarios').insert([{ nome, email }])
    if (error) return res.status(500).json({ error: error.message })
   
    return json(data);
  }
  
  async function deletarUsuario(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);
  
    if (error) {
      return { success: false, error: error.message };
    }
  
    return { success: true, msg: 'Deletado com sucesso!', data };
  }
  

  module.exports = { adicionarUsuario, deletarUsuario};