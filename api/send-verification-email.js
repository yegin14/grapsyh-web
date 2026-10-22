const nodemailer = require('nodemailer');

function getSmtpTransporter() {
    const host = process.env.SMTP_HOST || 'mail.spacemail.com';
    const port = parseInt(process.env.SMTP_PORT || '465');
    const user = process.env.SMTP_USER || 'iletisim@grapsyh.cyou';
    const pass = process.env.SMTP_PASS || '';

    if (!pass) return null;

    return nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
    });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    try {
        const { email, username, verifyToken, originUrl } = req.body || {};
        if (!email) {
            res.status(400).json({ error: 'E-posta adresi gereklidir.' });
            return;
        }

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
                .footer { margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px; font-size: 12px; color: #64748b; text-align: center; }
            </style>
        </head>
        <body>
            <div class="card">
                <a href="${baseUrl}" class="logo">GRAPSYH RETAIL</a>
                <h2>Hesabınızı Doğrulayın</h2>
                <p>Merhaba <strong>${username || 'Kullanıcımız'}</strong>,</p>
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
            res.status(200).json({
                sent: false,
                reason: 'no_smtp_pass',
                message: 'Sunucuda Spacemail SMTP şifresi henüz girilmediği için e-posta gönderilemedi.'
            });
            return;
        }

        const info = await transporter.sendMail({
            from: '"Grapsyh Retail" <iletisim@grapsyh.cyou>',
            to: email,
            subject: 'Grapsyh Hesabınızı Doğrulayın',
            html: mailHtml
        });

        res.status(200).json({ sent: true, messageId: info.messageId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
