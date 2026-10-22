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
        const { email, buyerName, orderId, items, total, date, originUrl } = req.body || {};
        if (!email || !items) {
            res.status(400).json({ error: 'E-posta ve ürün bilgileri gereklidir.' });
            return;
        }

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
                    Bu lisans kodları aynı zamanda hesabınızın <strong>Profilim &gt; Satın Aldığım Kodlar</strong> bölümünde de saklanmaktadır.
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
            res.status(200).json({
                sent: false,
                reason: 'no_smtp_pass',
                message: 'Sunucuda Spacemail SMTP şifresi henüz girilmedi.'
            });
            return;
        }

        const info = await transporter.sendMail({
            from: '"Grapsyh Sipariş Merkezi" <iletisim@grapsyh.cyou>',
            to: email,
            subject: `Siparişiniz Teslim Edildi: ${orderId}`,
            html: mailHtml
        });

        res.status(200).json({ sent: true, messageId: info.messageId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
