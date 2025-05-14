require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { adicionarUsuario } = require("./services/users.js");
const {adicionarMovimentacao} = require("./services/movimentacao.js")

async function enviarAudioParaWhisper(caminhoAudio) {
    const form = new FormData();
    form.append('file', fs.createReadStream(caminhoAudio));
    form.append('model', 'whisper-1');
    form.append('language', 'pt');

    try {
        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                ...form.getHeaders()
            }
        });

        console.log('Texto transcrito:', response.data.text);
        return response.data.text;
    } catch (error) {
        console.error('Erro ao enviar para Whisper:', error.response?.data || error.message);
        throw error;
    }
}

async function enviarTextoParaGPT(texto) {
    const prompt = `
Extraia do texto abaixo as seguintes informações e retorne apenas o JSON, sem explicações:
- erro: 0 ou 1 (caso o audio sejá algo sem contexto ou não seja possível interpretar)
- msg_erro: Pequeno feedback do erro se sera enviado na mensagem de volta
- fluxo: 0 (entrada, ganhos, lucros) ou 1 (saida, gastos)
- valor: número sem símbolo (ex: 23.50, converter em reais caso outra moeda seja mensionada)
- produto: nome do produto comprado
- local: Nome do Estabelecimento
- data: no formato AAAA/MM/DD
- forma_pagamento: Dinheiro, Cartão, Pix ou Boleto.
- carteira: ex: Cartão Nubank, Conta Corrente Itau, Cofrinho

Exemplo:

{
  "erro": 0,
  "msg_erro" : null,
  "fluxo": 1,
  "valor": 23.00,
  "produto": "Rosca Cremosa",
  "local": "Padaria Estrela",
  "data": 2025/04/30,
  "forma_pagamento": null
  "carteira": Conta PicPay
}

Texto:
"${texto}"
`;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo", 
            // model: "gpt-4o", // ou "gpt-3.5-turbo" se quiser economizar
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: 0 // deixa mais "preciso", sem inventar
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('JSON extraído:', response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Erro ao enviar para GPT:', error.response?.data || error.message);
        throw error;
    }
}

async function processarAudio() {
    const caminhoAudioWav = './audios/audio.wav';

    try {
        const texto = await enviarAudioParaWhisper(caminhoAudioWav);
        const jsonExtraido = await enviarTextoParaGPT(texto);
        const dados = JSON.parse(jsonExtraido);

        return dados;
    } catch (err) {
        console.error('Erro geral no processamento do áudio:', err);
        return {
            erro: 1,
            msg_erro: "Não foi possível interpretar o áudio."
        };
    }
}

module.exports = {processarAudio};