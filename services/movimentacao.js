const supabase = require('./db.js');
const {pegarUsuario} = require('./users.js');

async function verMovimentacoes(id){
    // let query = supabase.from('movimentacao').select("*");

    const { data, error } = await supabase
      .from('movimentacao')
      .select("*")
      .eq('id_usuario', id);
  
    if (error) {
      return { success: false, error: error.message };
    }
  
    return { success: true, data };
  }

  async function adicionarMovimentacao(dados, numero_telefone) {
    const { erro, msg_erro, fluxo, valor, produto, local, data, forma_pagamento, carteira } = dados;
  
    const usuario = await pegarUsuario({ celular: numero_telefone });  // Garantir que a função retorne a promessa resolvida
    const usuarioId = usuario.data.id;  // Supondo que a função 'pegarUsuario' retorne um objeto com 'id'
  
    if (erro === 1) {
      return { success: false, message: msg_erro || "Erro na transcrição dos dados." };
    }
  
    const now = new Date();
    
    const { data: insertData, error } = await supabase
      .from('movimentacao')
      .insert([{
        fluxo,
        valor,
        produto,
        local,
        data,
        created_at : now,
        forma_pagamento,
        carteira,
        id_usuario: usuarioId // Adiciona o id do cliente
      }]);
  
    if (error) {
      return { success: false, message: error.message };
    }
  
    return { success: true, data: insertData };
  }

module.exports = {verMovimentacoes, adicionarMovimentacao}