require('dotenv').config();
const axios = require('axios');
const express = require('express');
const router = express.Router();
const { verMovimentacoes } = require('../services/movimentacao');

async function enviarTextoParaGPT(movs) {
    const prompt = `Você é um assistente financeiro inteligente. Analise as movimentações financeiras abaixo e gere um resumo detalhado e compreensível do mês, como se estivesse falando com o próprio usuário. Use uma linguagem amigável e clara. 

As informações devem incluir:

1. 📊 Um resumo geral com:
   - Receitas totais
   - Despesas totais
   - Saldo final
   - % do salário comprometido

2. 🧾 Gastos por categoria (com valor e % sobre as despesas totais)

3. 📌 Insights e recomendações práticas:
   - Pontos positivos
   - Alertas importantes
   - Possibilidades de economia ou investimentos
   - Dicas baseadas nos dados

4. 🎯 Se possível, mencione:
   - Impacto de receitas extras
   - Sugestões de metas
   - Comparações com meses anteriores (se os dados existirem)

Segue abaixo as movimentações:
${JSON.stringify(movs, null, 2)}
`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "user", content: prompt }
                ],
                temperature: 0,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Erro ao enviar para GPT:', error.response?.data || error.message);
        throw error;
    }
}

router.get('/', async (req, res) => {
    try {
        console.log("Caiu aqui");
        const id = req.query.idusuario;

        if (!id) {
            return res.status(400).json({ error: 'idusuario não fornecido' });
        }

        const movs = (await verMovimentacoes(id)).data;

        const resumo = await enviarTextoParaGPT(movs);

        res.status(200).json({ resumo });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar resumo financeiro' });
    }
});

module.exports = router;
