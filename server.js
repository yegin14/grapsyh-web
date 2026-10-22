const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const PORT = 3000;

// .env dosyasını otomatik oku (varsa)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const [k, ...v] = trimmed.split('=');
            if (k) process.env[k.trim()] = v.join('=').trim();
        }
    });
}

// Spacemail SMTP Yapılandırması
function getSmtpTransporter() {
    const host = process.env.SMTP_HOST || 'mail.spacemail.com';
    const port = parseInt(process.env.SMTP_PORT || '465');
    const user = process.env.SMTP_USER || 'iletisim@grapsyh.cyou';
    const pass = process.env.SMTP_PASS || '';

    if (!pass) {
        return null; // Şifre henüz tanımlanmamış
    }

    return nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465,
        auth: {
            user: user,
            pass: pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });
}

// 1. Doğrulama E-Postası Gönderme Fonksiyonu
async function sendVerificationEmail(toEmail, username, verifyToken, originUrl) {
    const baseUrl = originUrl || 'https://www.grapsyh.cyou';
    const verifyLink = `${baseUrl}/?verify_email=${verifyToken}`;
    const transporter = getSmtpTransporter();

    const mailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1120; color: #f1f5f9; margin: 0; padding: 24px; }
            .card { max-width: 560px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            .logo { font-size: 20px; font-weight: 800; color: #38bdf8; margin-bottom: 24px; text-decoration: none; display: inline-block; }
            h2 { color: #ffffff; font-size: 22px; margin-top: 0; }
            p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
            .btn { display: inline-block; background-color: #0284c7; color: #ffffff !important; font-weight: bold; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 10px; margin: 24px 0; }
            .link-box { background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 12px; color: #38bdf8; word-break: break-all; margin-top: 16px; }
            .footer { margin-top: 32px; pt-4; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center; }
        </style>
    </head>
    <body>
        <div class="card">
            <a href="${baseUrl}" class="logo">GRAPSYH RETAIL</a>
            <h2>Hesabınızı Doğrulayın</h2>
            <p>Merhaba <strong>${username}</strong>,</p>
            <p>Grapsyh dijital lisans pazaryerine hoş geldiniz! Hesabınızı aktifleştirmek, güvenle alışveriş yapmak ve lisans kodlarınızı teslim almak için lütfen aşağıdaki butona tıklayarak e-posta adresinizi doğrulayın:</p>
            
            <div style="text-align: center;">
                <a href="${verifyLink}" class="btn" target="_blank">E-Posta Adresimi Doğrula</a>
            </div>

            <p style="font-size: 12px; color: #64748b;">Buton çalışmıyorsa aşağıdaki bağlantıyı doğrudan tarayıcınıza yapıştırabilirsiniz:</p>
            <div class="link-box">${verifyLink}</div>

            <div class="footer">
                <p>&copy; 2026 Grapsyh Retail. Perakende İnternet Hizmetleri.<br>
                Sorularınız için: <a href="mailto:iletisim@grapsyh.cyou" style="color: #38bdf8;">iletisim@grapsyh.cyou</a></p>
            </div>
        </div>
    </body>
    </html>
    `;

    if (!transporter) {
        console.log(`[SMTP UYARI] SMTP Şifresi tanımlı değil. Doğrulama e-postası gönderilemedi: ${toEmail} | Link: ${verifyLink}`);
        return {
            sent: false,
            reason: 'no_smtp_pass',
            message: 'Sunucuda Spacemail SMTP şifresi henüz girilmediği için e-posta gönderilemedi.',
            verifyLink: verifyLink
        };
    }

    const info = await transporter.sendMail({
        from: '"Grapsyh Retail" <iletisim@grapsyh.cyou>',
        to: toEmail,
        subject: 'Grapsyh Hesabınızı Doğrulayın',
        html: mailHtml
    });

    console.log(`[SMTP BAŞARILI] Doğrulama e-postası iletildi: ${toEmail} (MessageId: ${info.messageId})`);
    return { sent: true, messageId: info.messageId, verifyLink: verifyLink };
}

// 2. Sipariş & Lisans Kodu Teslimat E-Postası Gönderme Fonksiyonu
async function sendOrderDeliveryEmail(toEmail, buyerName, orderId, items, total, date, originUrl) {
    const baseUrl = originUrl || 'https://www.grapsyh.cyou';
    const transporter = getSmtpTransporter();

    let itemsHtml = '';
    items.forEach(it => {
        itemsHtml += `
            <div style="background: #020617; border: 1px solid #1e293b; border-radius: 10px; padding: 14px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #ffffff; margin-bottom: 6px;">
                    <span>${it.title}</span>
                    <span style="color: #38bdf8;">${parseFloat(it.price).toFixed(2)} ₺</span>
                </div>
                <div style="font-family: monospace; font-size: 13px; color: #10b981; background: #0f172a; padding: 8px 12px; border-radius: 6px; letter-spacing: 1px; word-break: break-all;">
                    ${it.key}
                </div>
            </div>
        `;
    });

    const mailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1120; color: #f1f5f9; margin: 0; padding: 24px; }
            .card { max-width: 580px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; }
            .logo { font-size: 20px; font-weight: 800; color: #38bdf8; text-decoration: none; }
            .badge { display: inline-block; background: #064e3b; color: #34d399; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 20px; }
            .meta { background: #020617; border: 1px solid #1e293b; border-radius: 10px; padding: 14px; margin: 20px 0; font-size: 13px; color: #94a3b8; }
            .footer { margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px; font-size: 12px; color: #64748b; text-align: center; }
        </style>
    </head>
    <body>
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <a href="${baseUrl}" class="logo">GRAPSYH RETAIL</a>
                <span class="badge">Sipariş Onaylandı</span>
            </div>
            <h2 style="color: #ffffff; margin-top: 0;">Siparişiniz ve Lisans Kodunuz Hazır!</h2>
            <p style="color: #94a3b8; font-size: 14px;">Sayın <strong>${buyerName || 'Müşterimiz'}</strong>, Grapsyh üzerinden gerçekleştirdiğiniz alışveriş başarıyla tamamlanmıştır. Satın aldığınız dijital ürün anahtarları aşağıdadır:</p>

            <div class="meta">
                <div><strong>Sipariş No:</strong> ${orderId}</div>
                <div><strong>Tarih:</strong> ${date}</div>
                <div><strong>Toplam Tutar:</strong> ${parseFloat(total).toFixed(2)} ₺</div>
            </div>

            <h3 style="font-size: 14px; color: #e2e8f0; margin-bottom: 12px;">Teslim Edilen Lisans Kodları:</h3>
            ${itemsHtml}

            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
                Bu lisans kodları aynı zamanda hesabınızın <strong>Profilim &gt; Satın Aldığım Kodlar</strong> bölümünde de saklanmaktadır. Kodları ilgili yazılım sağlayıcısının resmi portalında etkinleştirebilirsiniz.
            </p>

            <div class="footer">
                <p>&copy; 2026 Grapsyh Retail. Perakende İnternet Hizmetleri.<br>
                Destek ve İletişim: <a href="mailto:iletisim@grapsyh.cyou" style="color: #38bdf8;">iletisim@grapsyh.cyou</a></p>
            </div>
        </div>
    </body>
    </html>
    `;

    if (!transporter) {
        console.log(`[SMTP UYARI] SMTP Şifresi tanımlı değil. Sipariş e-postası gönderilemedi: ${toEmail} (Sipariş: ${orderId})`);
        return {
            sent: false,
            reason: 'no_smtp_pass',
            message: 'Sunucuda Spacemail SMTP şifresi henüz girilmediği için teslimat e-postası gönderilemedi.'
        };
    }

    const info = await transporter.sendMail({
        from: '"Grapsyh Sipariş Merkezi" <iletisim@grapsyh.cyou>',
        to: toEmail,
        subject: `Siparişiniz Teslim Edildi: ${orderId}`,
        html: mailHtml
    });

    console.log(`[SMTP BAŞARILI] Sipariş e-postası iletildi: ${toEmail} (MessageId: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
}

// HTTP Sunucu
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

    // JSON Body Okuyucu
    async function readJsonBody() {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                try {
                    resolve(body ? JSON.parse(body) : {});
                } catch (e) {
                    reject(e);
                }
            });
            req.on('error', reject);
        });
    }

    // 1. API: Doğrulama E-Postası Gönder
    if (req.url === '/api/send-verification-email' && req.method === 'POST') {
        try {
            const body = await readJsonBody();
            const { email, username, verifyToken, originUrl } = body;
            if (!email) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'E-posta adresi zorunludur.' }));
                return;
            }

            const result = await sendVerificationEmail(email, username, verifyToken, originUrl);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } catch (err) {
            console.error('Doğrulama E-Postası Hatası:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // 2. API: Sipariş Teslimat E-Postası Gönder
    if (req.url === '/api/send-order-email' && req.method === 'POST') {
        try {
            const body = await readJsonBody();
            const { email, buyerName, orderId, items, total, date, originUrl } = body;
            if (!email || !items) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'E-posta ve ürün bilgileri zorunludur.' }));
                return;
            }

            const result = await sendOrderDeliveryEmail(email, buyerName, orderId, items, total, date, originUrl);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } catch (err) {
            console.error('Sipariş E-Postası Hatası:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // 3. API: SMTP Şifresini Kaydet / Güncelle
    if (req.url === '/api/save-smtp-settings' && req.method === 'POST') {
        try {
            const body = await readJsonBody();
            const { host, port, user, pass } = body;

            if (pass) process.env.SMTP_PASS = pass;
            if (host) process.env.SMTP_HOST = host;
            if (port) process.env.SMTP_PORT = port;
            if (user) process.env.SMTP_USER = user;

            // .env dosyasına yaz
            const envLines = [
                `SMTP_HOST=${process.env.SMTP_HOST || 'mail.spacemail.com'}`,
                `SMTP_PORT=${process.env.SMTP_PORT || '465'}`,
                `SMTP_USER=${process.env.SMTP_USER || 'iletisim@grapsyh.cyou'}`,
                `SMTP_PASS=${process.env.SMTP_PASS || ''}`
            ];
            fs.writeFileSync(envPath, envLines.join('\n'), 'utf8');

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'SMTP ayarları kaydedildi.' }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // 4. API: Sumsub Token Endpoint'i (Güvenli Beklemede)
    if (req.url.startsWith('/api/sumsub-token')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'standby', 
            message: 'Biyometrik doğrulama sistemi kurumsal onay sonrasında aktif hale getirilecektir.' 
        }));
        return;
    }

    // 5. Statik Dosyalar (index.html, privacy.html, privacy-en.html)
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
    console.log(`📧 E-Posta Servisleri: Aktif (mail.spacemail.com:465)`);
    console.log(`========================================================\n`);
});
