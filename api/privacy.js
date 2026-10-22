module.exports = (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(`<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gizlilik Politikası (Privacy Policy) | Grapsyh</title>
    <meta name="description" content="Grapsyh Privacy Policy and Data Protection. Sumsub identity verification, biometric data processing, and compliance standards.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-slate-950 text-slate-200 min-h-screen flex flex-col antialiased selection:bg-sky-500 selection:text-white">

    <header class="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white"><i class="fa-solid fa-cube"></i></div>
                <span class="text-xl font-extrabold text-white">GRAPSYH</span>
            </a>
            <a href="/" class="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1.5 transition">
                <i class="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
            </a>
        </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-12 flex-1 w-full">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
            
            <div class="border-b border-slate-800 pb-6 mb-8">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/20 mb-3">
                    <i class="fa-solid fa-shield-check"></i> Resmi Yasal Doküman
                </div>
                <h1 class="text-2xl sm:text-3xl font-extrabold text-white">Gizlilik ve Veri Güvenliği Politikası</h1>
                <p class="text-xs text-slate-400 mt-2">Privacy Policy & Biometric Verification Compliance • Son Güncelleme: 22 Ekim 2026</p>
            </div>

            <div class="space-y-8 text-sm leading-relaxed text-slate-300">
                
                <section>
                    <h2 class="text-base font-bold text-white mb-2 flex items-center gap-2">
                        <span class="w-6 h-6 rounded-md bg-slate-800 text-sky-400 text-xs flex items-center justify-center">1</span>
                        Veri Sorumlusu (Data Controller)
                    </h2>
                    <p>
                        İşbu Gizlilik Politikası, <strong>Grapsyh Retail</strong> tarafından işletilen <strong>grapsyh.cyou</strong> web sitesi üzerinden sunulan dijital perakende ve P2P pazaryeri hizmetlerinde toplanan kişisel verilerin korunması usullerini belirler.
                    </p>
                    <p class="mt-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-400">
                        <strong>İletişim & Veri Sorumlusu:</strong><br>
                        Web: <a href="https://grapsyh.cyou" class="text-sky-400 underline">https://grapsyh.cyou</a><br>
                        E-Posta: <a href="mailto:iletisim@grapsyh.cyou" class="text-sky-400 underline">iletisim@grapsyh.cyou</a>
                    </p>
                </section>

                <section>
                    <h2 class="text-base font-bold text-white mb-2 flex items-center gap-2">
                        <span class="w-6 h-6 rounded-md bg-slate-800 text-sky-400 text-xs flex items-center justify-center">2</span>
                        Toplanan Kişisel Veriler (Data We Collect)
                    </h2>
                    <p>Platformumuz üzerinden alış ve satış yapabilmeniz için aşağıdaki veriler toplanabilmektedir:</p>
                    <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-400 text-xs">
                        <li><strong>Hesap Bilgileri:</strong> Ad, soyad, kullanıcı adı, e-posta adresi ve şifre.</li>
                        <li><strong>İşlem ve Sipariş Verileri:</strong> Satın alınan veya satışa sunulan dijital lisans kodları, işlem tutarı ve tarih kayıtları.</li>
                        <li><strong>Teknik & Cihaz Verileri:</strong> IP adresi, tarayıcı türü ve güvenlik logları.</li>
                        <li><strong>Kimlik ve Doğrulama Verileri (KYC):</strong> Resmi kimlik belgesi ve canlılık (liveness/selfie) yüz tanıma verileri.</li>
                    </ul>
                </section>

                <section class="bg-sky-950/20 border border-sky-900/40 p-5 rounded-2xl">
                    <h2 class="text-base font-bold text-white mb-2 flex items-center gap-2">
                        <span class="w-6 h-6 rounded-md bg-sky-500/20 text-sky-400 text-xs flex items-center justify-center">3</span>
                        Kimlik ve Biyometrik Verilerin İşlenmesi (Identity & Biometrics / Sumsub)
                    </h2>
                    <p class="text-xs leading-relaxed">
                        Grapsyh; çalıntı kredi kartı kullanımını, yetkisiz bakiye çekimini ve dolandırıcılığı önlemek amacıyla üçüncü taraf resmi kimlik doğrulama servis sağlayıcısı olan <strong>Sum and Substance Ltd (Sumsub)</strong> altyapısını kullanmaktadır.
                    </p>
                    <div class="mt-3 text-xs space-y-2 text-slate-300">
                        <p>
                            <strong>İşleme Amacı:</strong> Kimliğin teyidi, 3D Secure / AML (Kara Para Aklamayı Önleme) uyumluluğu ve dijital kodların yalnızca gerçek kart sahiplerine teslim edilmesini sağlamak.
                        </p>
                        <p>
                            <strong>Güvenlik Standardı:</strong> Biyometrik veriler en yüksek endüstri standartlarında (ISO/IEC 27001 ve SOC 2 Type II uyumlu) şifreli olarak işlenir; üçüncü taraflara ticari veya reklam amacıyla kesinlikle aktarılmaz.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 class="text-base font-bold text-white mb-2 flex items-center gap-2">
                        <span class="w-6 h-6 rounded-md bg-slate-800 text-sky-400 text-xs flex items-center justify-center">4</span>
                        Veri Güvenliği ve Saklama Süresi (Data Security & Retention)
                    </h2>
                    <p class="text-xs text-slate-400">
                        Platformumuzdaki tüm veri iletişimi <strong>256-Bit SSL (TLS 1.3)</strong> şifreleme protokolleri ile korunmaktadır. Kişisel veriler hizmetin sunulması için gerekli olduğu müddetçe güvenli sunucularda saklanır; süresi dolan veriler re'sen veya talep üzerine silinir.
                    </p>
                </section>

                <section>
                    <h2 class="text-base font-bold text-white mb-2 flex items-center gap-2">
                        <span class="w-6 h-6 rounded-md bg-slate-800 text-sky-400 text-xs flex items-center justify-center">5</span>
                        Kullanıcı Hakları (Your Rights under GDPR & KVKK)
                    </h2>
                    <p class="text-xs text-slate-400">
                        İlgili veri sahibi olarak dilediğiniz zaman; verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme ve verilerinizin silinmesini talep etme hakkına sahipsiniz. Başvurularınızı <a href="mailto:iletisim@grapsyh.cyou" class="text-sky-400 underline font-semibold">iletisim@grapsyh.cyou</a> adresine iletebilirsiniz.
                    </p>
                </section>

            </div>

            <div class="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <span>&copy; 2026 Grapsyh Retail. All Rights Reserved.</span>
                <span>grapsyh.cyou / Privacy Policy</span>
            </div>

        </div>
    </main>

</body>
</html>`);
};
