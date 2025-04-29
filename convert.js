const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');

// Define o caminho do ffmpeg baixado
ffmpeg.setFfmpegPath(ffmpegPath);

// Função para converter
function convertOggToWav(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat('wav')
            .on('error', (err) => {
                console.error('Erro na conversão:', err);
                reject(err);
            })
            .on('end', () => {
                console.log('Conversão concluída!');
                resolve(outputPath);
            })
            .save(outputPath);
    });
}

// Exemplo de uso:
const inputAudio = path.join(__dirname, 'audios', 'audio.ogg');
const outputAudio = path.join(__dirname, 'audios', 'audio.wav');

convertOggToWav(inputAudio, outputAudio);
