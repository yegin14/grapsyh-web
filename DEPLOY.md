# Grapsyh Retail - Canlıya Alma Rehberi (0 TL Hosting)

Web sitenizi `grapsyh.cyou` alan adınızda **tamamen ücretsiz ve ömür boyu sınırsız trafikle** yayına almak için en kolay iki yöntem:

---

## 1. Yöntem: Cloudflare Pages ile Yayına Alma (Önerilen)

1. [Cloudflare Dashboard](https://dash.cloudflare.com)'a ücretsiz kaydolun veya giriş yapın.
2. Sol menüden **"Workers & Pages"** bölümüne girin.
3. **"Create Application" -> "Pages" -> "Upload assets"** seçeneğini seçin.
4. Proje adına `grapsyh` yazın.
5. `C:\Users\Halil\.gemini\antigravity\scratch\grapsyh-web` klasöründeki dosyaları (özellikle `index.html`) sürükleyip bırakın ve **Deploy**'a basın.
6. Proje oluştuktan sonra **"Custom domains"** sekmesine girip **`grapsyh.cyou`** yazın.
7. Cloudflare size bir CNAME kaydı verecektir; alan adını aldığınız sitedeki DNS paneline bu CNAME kaydını ekleyin. Site anında SSL ile aktif olur!

---

## 2. Yöntem: Vercel ile 1 Dakikada Yayına Alma

1. [Vercel.com](https://vercel.com)'a ücretsiz kaydolun.
2. "Add New Project" diyerek bu klasörü yükleyin.
3. "Domains" sekmesinden `grapsyh.cyou` alan adınızı ekleyin.
4. Spaceship/Namecheap DNS paneline Vercel'in verdiği **A Kaydı (`76.76.21.21`)** veya **CNAME** kaydını girin.

---

## Yerel Olarak Çalıştırma

Bilgisayarınızda test etmek için terminalde şu komutu çalıştırabilirsiniz:
```bash
node server.js
```
Tarayıcınızdan `http://localhost:3000` adresine girerek hemen inceleyebilirsiniz.
