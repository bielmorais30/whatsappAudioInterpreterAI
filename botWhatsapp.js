const qrcode = require("qrcode-terminal");
const path = require("path");
const { Client, LocalAuth } = require("whatsapp-web.js");
const { adicionarMovimentacao } = require("./services/movimentacao.js");
const { convertOggToWav } = require("./convert.js");
const {processarAudio} = require("./audioScan.js");

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "meu-bot", // vai criar .wwebjs_auth/meu-bot
  }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

const fs = require("fs");

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("Sessão autenticada com sucesso!");
});

client.on("auth_failure", (msg) => {
  console.error("Falha na autenticação:", msg);
});

const whiteList = ["5516993892506"];

// Listening to all incoming messages
client.on("message_create", async (msg) => {
  // Criar condição para só análisar as mensagens de uma conversa em específico
  let sender = msg.from.split("@");
  sender = sender[0];

  if (whiteList.includes(sender)) {
    console.log("Cliente autenticado: " + sender);
    if (msg.hasMedia) {
      const media = await msg.downloadMedia();

      if (media.mimetype.startsWith("audio")) {
        console.log("Áudio recebido!");

        // Salvar o áudio em um arquivo
        // const fileName = `audio-${Date.now()}.ogg`;
        const fileName = `audio.ogg`;
        fs.writeFileSync(`./audios/${fileName}`, media.data, {
          encoding: "base64",
        });

        console.log(`Áudio salvo como: ./audios/${fileName}`);

        const inputAudio = path.join(__dirname, "audios", "audio.ogg");
        const outputAudio = path.join(__dirname, "audios", "audio.wav");

        // require('./convert.js')
        convertOggToWav(inputAudio, outputAudio)
          .then(() => {
            return processarAudio(); // Retorna a Promise da função
          })
          .then((dados) => {
            msg.reply(`Adicionando nova movimentação:\n ${JSON.stringify(dados)}`);
            return adicionarMovimentacao(dados, sender); // Retorna a Promise da função
          })
          .then((resultado) => {
            if (!resultado.success) {
              console.log("Erro ao adicionar movimentação:", resultado.message);
              msg.reply(`Erro ao adicionar! ${resultado.message}`);
              
            } else {
              console.log("Movimentação salva com sucesso!", resultado.data);
              msg.reply(`Adicionando com sucesso!`);
            }
          })
          .catch((err) => {
            console.error("Erro em alguma etapa do processamento:", err);
          });


      }
    } // Criar fluxo caso a mensagem não seja um audio (enviar para I.A)
  }
});

client.initialize();
