# Frontend Starter Pack

Next.js, TypeScript, Tailwind CSS ve diğer güçlü araçlarla oluşturulmuş modern, modüler ve tip güvenliği olan bir frontend başlangıç kiti. Bu başlangıç paketi, domain-driven yapıyı benimser, fonksiyonel programlama prensiplerini uygular ve tip güvenliğini zorunlu kılar.

## Başlangıç

### Gereksinimler

- Node.js (v18 veya üstü önerilir)
- pnpm (v10.10.0 veya üstü)

### Kurulum

```bash
# Repo klonla
git clone @fe-starter-pack my-frontend-app
cd my-frontend-app

# Bağımlılıkları yükle
pnpm install

# Geliştirme sunucusunu başlat
pnpm dev
```

Uygulama http://localhost:1996 adresinde çalışacak

## Build ve Deployment

```bash
# Uygulamayı derle
pnpm build

# Prodüksiyon sunucusunu başlat
pnpm start

# Prodüksiyon derlemeyi yerel olarak önizle
pnpm preview
```

## Temel Özellikler

- **Next.js 15**: Pages directory ile en son sürüm
- **TypeScript**: Sıkı tip kontrolü ile tip güvenliği olan kod
- **Tailwind CSS**: Özel yapılandırmalarla utility-first CSS framework
- **i18n Desteği**: next-i18next ile uluslararasılaştırma
- **State Yönetimi**: Persist desteği ile Redux Toolkit
- **Kimlik Doğrulama**: Route koruması ile auth sistemi
- **Form İşleme**: Zod validasyonu ile React Hook Form
- **UI Bileşenleri**: Tailwind ile entegre edilmiş Radix UI primitive'leri
- **Veri Çekme**: TanStack React Query
- **Kod Kalitesi**: ESLint, Prettier ve Husky hooks

## Proje Yapısı

Proje, domain-driven, modüler bir mimariyi takip eder:

```
src/
├── components/             # Yeniden kullanılabilir UI bileşenleri
│   ├── hooks/              # Özel React hook'ları (domain bağımsız)
│   ├── layout/             # Layout bileşenleri
│   ├── pages/              # Sayfaya özgü bileşenler
│   │   ├── auth/           # Kimlik doğrulama ile ilgili sayfalar
│   │   │   ├── styles/     # Giriş sayfası stilleri
│   │   │   ├── components/ # Giriş sayfası bileşenleri
│   │   │   ├── services/   # Giriş sayfası servisleri
│   │   │   ├── hooks/      # Giriş sayfası hook'ları
│   │   │   ├── store/      # Giriş sayfası store yapılandırması
│   │   │   └── index.tsx   # Giriş sayfası
│   │   ├── authorized/     # Korumalı sayfalar
│   │   └── landing/        # Genel sayfalar
│   ├── styles/             # Global stiller
│   └── ui/                 # Genel UI bileşenleri
├── config/                 # Uygulama yapılandırması
├── constants/              # Sabitler ve enum'lar
├── decorators/             # Yüksek seviyeli bileşenler
├── lib/                    # Yardımcı kütüphaneler
├── pages/                  # Next.js sayfaları
├── server/                 # Sunucu tarafı kod
├── store/                  # Redux store yapılandırması
└── styles/                 # Global stiller
```

## Geliştirme Yönergeleri

### Modüler Yapı

- Her modül kendi alanına odaklanmalı ve kendi içinde bağımsız olmalıdır
- İlgili işlevselliği teknik rol yerine domain'e göre gruplandırın
- Bileşen dosyalarını küçük tutun ve tek bir sorumluluğa odaklayın
- Tekrar eden kod olabilir, bunu kabul ediyoruz

### Fonksiyonel Programlama

- Saf fonksiyonları ve değişmezliği (immutability) tercih edin
- Sadece fonksiyonel bileşenler kullanın
- State ve side effects için React hook'larını kullanın
- Class bileşenlerinden ve zorunlu programlama modellerinden kaçının

### Domain-Driven Tasarım

- Her modül, domain'i ile ilgili tüm gerekli dosyaları içermelidir
- Bileşenler, tipe göre değil, domain'e göre organize edilmelidir (örn. auth, user, dashboard)
- Domain'ler arası bağımlılıkları minimize edin

### Tip Güvenliği

- Tüm değişkenler, fonksiyonlar ve bileşenler için TypeScript tipleri zorunludur
- Kesinlikle gerekli olmadıkça `any` tipi kullanılmamalıdır
- Tüm veri yapıları için interface'ler ve tipler tanımlayın
- Harici veri validasyonu için zod kullanın

### CSS Yönergeleri

- Stillendirme için Tailwind CSS kullanın
- Bileşene özgü stillendirme için gerektiğinde CSS-in-JS (Tailwind aracılığıyla) kullanın
- Özel CSS sınıfları için BEM adlandırma kuralını takip edin
- Stillendirmeyi uygulandıkları bileşenlere yakın tutun
- CSS dosyaları içerisinde hem Tailwind hem de pure CSS kullanılabilmektedir

Örnek:

```
.tabs-scroller {
  @apply flex flex-1 gap-4 overflow-x-auto;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
```

### Kod Kalitesi

Proje, kod kalitesini korumak için çeşitli araçlar içerir:

```bash
# Tip kontrolü
pnpm typecheck

# Linting
pnpm lint

# Linting sorunlarını düzeltme
pnpm lint:fix

# Kodu formatla
pnpm format:write

# Format kontrolü
pnpm format:check

# Tüm kontrolleri çalıştır
pnpm check
```

## Uluslararasılaştırma

Proje, uluslararasılaştırma için next-i18next kullanır. Çeviri dosyaları `/public/locales/` dizininde bulunur.

Kullanım örneği:

```typescript
import { useTranslation } from 'next-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('common.title')}</h1>;
}
```

## Kimlik Doğrulama

Kimlik doğrulama Next-Auth ile yönetilir. Korumalı rotalar, middleware kontrolleri ile sunucu taraflı işleme (SSR) kullanılarak uygulanmıştır.

## Lisans

[MIT](LICENSE)
