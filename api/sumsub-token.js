const crypto = require('crypto');

const APP_TOKEN = 'sbx:yt1TK0FxMCaMn4jLsvalTmjK.Y4DMkP8CPwM94v7rHTjaWit1zbSUCadD';
const SECRET_KEY = 'FrYu7xj4f2GvLXQdafgjl8w5wtLj554u';
const LEVEL_NAME = 'id-and-liveness';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    try {
        const ts = Math.floor(Date.now() / 1000).toString();
        const uri = '/resources/accessTokens/sdk';
        const payload = JSON.stringify({
            userId: 'web_user_' + Date.now(),
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
            res.status(response.status).json({ error: err });
            return;
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
