// pages/api/speak.ts
import fs from 'fs';
import path from 'path';
import util from 'util';
import {v4 as uuidv4} from 'uuid';
import textToSpeech from '@google-cloud/text-to-speech';

const client = new textToSpeech.TextToSpeechClient({
    keyFilename: 'PATH_TO_YOUR_SERVICE_ACCOUNT_FILE.json',
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const {text} = req.body;

    const request = {
        input: {text},
        voice: {
            languageCode: 'uz-UZ',
            name: 'uz-UZ-Wavenet-A',
        },
        audioConfig: {
            audioEncoding: 'MP3',
        },
    };

    // @ts-ignore
    const [response] = await client.synthesizeSpeech(request);
    const filename = `${uuidv4()}.mp3`;
    const filePath = path.join(process.cwd(), 'public', filename);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(filePath, response.audioContent, 'binary');

    res.status(200).json({audioUrl: `/${filename}`});
}
