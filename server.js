const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 3000;
const APP_TOKEN = 'sbx:yt1TK0FxMCaMn4jLsvalTmjK.Y4DMkP8CPwM94v7rHTjaWit1zbSUCadD';
const SECRET_KEY = 'FrYu7xj4f2GvLXQdafgjl8w5wtLj554u';
const LEVEL_NAME = 'id-and-liveness';

async function generateSumsubToken(userId) {
    const ts = Math.floor(Date.now() / 1000).toString();
    const uri = '/resources/accessTokens/sdk';
    const payload = JSON.stringify({
        userId: userId || 'web_user_' + Date.now(),
        ttlInSecs: 1800,
        levelName: LEVEL_NAME
    });

    const dataToSign = ts + 'POST' + uri + payload;
    const sig = crypto.createHmac('sha256', SECRET_KEY).update(dataToSign).digest('hex');

    const response = await fetch('https://api.sumsub.com' + uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-App-Token': APP_TOKEN,
            'X-App-Access-Ts': ts,
            'X-App-Access-Sig': sig
        },
        body: payload
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Sumsub API Hatası (${response.status}): ${err}`);
    }

    return await response.json();
}

const server = http.createServer(async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 1. Sumsub Token Endpoint'i
    if (req.url.startsWith('/api/sumsub-token')) {
        try {
            const data = await generateSumsubToken();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch (error) {
            console.error('Token Hatası:', error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

    // 2. Statik Dosyalar (index.html, privacy.html, privacy-en.html)
    const cleanUrl = req.url.split('?')[0];
    let file = 'index.html';
    if (cleanUrl === '/privacy' || cleanUrl === '/privacy.html') {
        file = 'privacy.html';
    } else if (cleanUrl === '/privacy-en' || cleanUrl === '/privacy-en.html') {
        file = 'privacy-en.html';
    }

    const filePath = path.join(__dirname, file);
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>Sayfa Bulunamadı (404)</h1>');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`\n========================================================`);
    console.log(`🚀 Grapsyh Yerel Geliştirme Sunucusu Başlatıldı!`);
    console.log(`🌐 Ana Sayfa:          http://localhost:${PORT}/`);
    console.log(`🛡️ Gizlilik Politikası: http://localhost:${PORT}/privacy.html`);
    console.log(`🔑 Token API:          http://localhost:${PORT}/api/sumsub-token`);
    console.log(`========================================================\n`);
});
