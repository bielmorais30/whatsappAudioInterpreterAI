const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();
const fs = require('fs');

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
// Listening to all incoming messages
client.on('message_create',  async msg => {
	if (msg.hasMedia) {
        const media = await msg.downloadMedia();

        if (media.mimetype.startsWith('audio')) {
            console.log('Áudio recebido!');

            // Salvar o áudio em um arquivo
            // const fileName = `audio-${Date.now()}.ogg`;
            const fileName = `audio.ogg`;
            fs.writeFileSync(`./audios/${fileName}`, media.data, { encoding: 'base64' });

            console.log(`Áudio salvo como: ./audios/${fileName}`);
        }
    }
});


client.initialize();
