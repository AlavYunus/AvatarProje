# AVATAR Backend - Go API Servisi

**AVATAR Backend** - Gıda üretim yönetim sistemi için geliştirilmiş Go (Golang) tabanlı backend servisi. MySQL veritabanı ile entegre edilmiş, RESTful API sunan mikro servis mimarisidir.

---

## 📋 Genel Bakış

Bu backend servisi, gıda üretiminde kullanılabilecek bir yönetim sistemi sağlar. Üretim emri yönetimi, parçalama işlemleri, satış kayıtları, lot bazlı izlenebilirlik ve raporlama özellikleri içerir.

### Proje Gereksinimlerine Göre Özellikler
- ✅ Üretim emri görüntüleme ve EKP hesaplama
- ✅ Parçalama işlemleri ve verim tahmini
- ✅ Lot bazlı stok kontrolü
- ✅ Satış ve geri iade yönetimi
- ✅ Raporlama ve analiz

---

## 🛠️ Teknoloji Stack

| Bileşen | Teknoloji | Versiyon |
|---------|-----------|----------|
| Backend Framework | Go (Golang) | 1.20+ |
| Web Server | Gorilla Mux | - |
| Database Driver | go-sql-driver/mysql | - |
| ORM | GORM | - |
| Containerization | Docker | 24.0 |

---

## 📦 Proje Yapısı

```
backend/
├── main.go              # Ana uygulama ve router tanımları
├── models.go            # Veritabanı modelleri (GORM)
├── consistency_check.go # Tutarsızlık kontrolü fonksiyonu
├── mysql_operations.sql # MySQL tablo oluşturma ve test verileri
├── docker-compose.yml   # Docker servis tanımları
├── Dockerfile           # Backend container build dosyası
├── go.mod               # Go modül dosyası
├── go.sum               # Go bağımlılık kilit dosyası
└── .env                 # Ortam değişkenleri (gizli)
```

---

## 🚀 Kurulum ve Çalıştırma

### Yöntem 1: Docker ile (Önerilen)

```bash
cd backend
docker-compose up -d
```

Docker Compose, MySQL veritabanını otomatik olarak başlatacak ve backend servisini port 8080'de çalıştıracaktır.

### Yöntem 2: Manuel Kurulum

1. **MySQL Veritabanı Oluşturma:**
   ```bash
   # XAMPP veya MySQL kontrol paneli ile
   mysql -u root -p
   CREATE DATABASE avatar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;
   USE avatar_db;
   source mysql_operations.sql
   ```

2. **Backend Servisi Başlatma:**
   ```bash
   # Ortam değişkenlerini ayarla
   echo "DB_HOST=localhost" > .env
   echo "DB_PORT=3306" >> .env
   echo "DB_USER=root" >> .env
   echo "DB_PASSWORD=password" >> .env
   echo "DB_NAME=avatar_db" >> .env

   # Backend servisini başlat
   go run main.go
   ```

---

## 🔧 Yapılandırma

### `.env` Dosyası (Backend)

```env
# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=avatar_db

# Application Configuration
APP_ENV=development
APP_PORT=8080

# JWT Configuration (if needed)
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRES_IN=24h

# Logging Configuration
LOG_LEVEL=debug
```

### Docker Compose Yapılandırması (`docker-compose.yml`)

Docker Compose, backend servisi ve MySQL veritabanını birlikte başlatır:

- **Backend Servisi:** Port 8080
- **MySQL Veritabanı:** Port 3306
- **Veritabanı Kullanıcısı:** `avatar_user` / `password`
- **Veritabanı Adı:** `avatar_db`

---

## 📡 API Endpoints

### Authentication (Kimlik Doğrulama)

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/auth/register` | POST | Yeni kullanıcı kaydı |
| `/api/auth/login` | POST | Kullanıcı girişi |
| `/api/auth/update-password` | POST | Şifre güncelleme |

### Üretim Yönetimi (Production)

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/production/orders` | GET | Tüm üretim emirlerini listeler |
| `/api/production/orders` | POST | Yeni üretim emri oluşturur |
| `/api/production/eKP/{orderNumber}` | GET | EKP (Gerçek Maliyet) hesaplar |

### Parçalama Yönetimi (Cut)

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/cut/products` | POST | Yeni parçalama işlemi oluşturur |

### Satış ve İade Yönetimi (Sales & Returns)

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/sales` | GET | Tüm satışları listeler |
| `/api/sales` | POST | Yeni satış kaydı oluşturur |
| `/api/returns` | POST | Geri iade kaydını oluşturur (bloke eder) |

### Lot İzlenebilirlik (Traceability)

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/lot-trace/{lotNumber}` | GET | Lot bazlı izlenebilirlik sorgusu |

### Stok Yönetimi (Stock)

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/stock/add` | POST | Yeni stok kaydı oluşturur |

### Raporlama (Reports)

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/reports/comprehensive` | GET | Kapsamlı raporlar |

### Anomali Takibi (AI)

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/anomalies/log` | POST | Anomali kaydeder |

---

## 🗄️ Veritabanı Modelleri

### Temel Tablolar

- **lots** - Lot bazlı izlenebilirlik için temel yapı
- **production_orders** - Üretim emri kayıtları
- **material_lines** - Üretim emrindeki hammadde detayları
- **finished_products** - Mamul ürünler
- **finished_product_lots** - Mamul lot detayları

### İşlem Tabloları

- **cuts** - Parçalama işlemleri
- **cut_products** - Parça ürün detayları
- **sales** - Satış kayıtları
- **returns** - Geri iade kayıtları
- **inventory** - Stok takibi
- **ai_predictions** - Yapay zeka tahminleri

---

## 🔍 Veritabanı İşlemleri

### EKP (Gerçek Maliyet) Hesaplama Formülü

```
EKP = (Hammadde Maliyeti + Hizmet Maliyeti) / Mamul Miktarı

Örnek hesaplama:
- Et: 100 kg × 9.70 TL = 970.00 TL
- Baharat: 2 kg × 24.00 TL = 48.00 TL
- Biberlik: 5 kg × 11.60 TL = 58.00 TL
- Hizmet: 85 paket × 5.50 TL = 467.50 TL
- Toplam: 1,543.50 TL
- EKP: 1,543.50 / 85 = 18.16 TL/paket
```

### Lot İzlenebilirliği Prensipleri

- Her hammadde girişine lot numarası, tarih, miktar ve son tüketim tarihi atanır
- Bir üretim emrinde birden fazla hammadde lotu kullanılabilir
- Bir hammadde lotu birden fazla mamul lote dönülebilir (çoktan-başa ilikiler)

---

## 🧪 Test Senaryoları

### Örnek Kullanım: Üretim Emri Oluşturma

```bash
curl -X POST http://localhost:8080/api/production/orders \
  -H "Content-Type: application/json" \
  -d '{
    "order_number": "URT-2026-045",
    "materials": [
      {"lot_id": 1, "material_type": "ET", "quantity": 100.0, "cost_per_unit": 9.70, "total_cost": 970.00},
      {"lot_id": 3, "material_type": "BAHARAT", "quantity": 2.0, "cost_per_unit": 24.00, "total_cost": 48.00},
      {"lot_id": 4, "material_type": "BIBERLIK", "quantity": 5.0, "cost_per_unit": 11.60, "total_cost": 58.00}
    ],
    "expected_output": 85.0,
    "factory_name": "Kardeşler Sucuk Fabrikası",
    "labor_cost": 467.50
  }'
```

### Örnek Kullanım: Stok Ekleme

```bash
curl -X POST http://localhost:8080/api/stock/add \
  -H "Content-Type: application/json" \
  -d '{
    "barcode": "ET-2026-001",
    "material_type": "ET",
    "quantity": 100.0
  }'
```

---

## 📝 Önemli Notlar

### Veritabanı Bağlantısı

Backend servisi, `.env` dosyasındaki yapılandırma kullanılarak MySQL veritabanına bağlanır:

- **DB_HOST:** `localhost` (XAMPP veya Docker)
- **DB_PORT:** `3306`
- **DB_USER:** `root` (veya `avatar_user` Docker'da)
- **DB_PASSWORD:** `password`
- **DB_NAME:** `avatar_db`

### XAMPP ile Çalıştırma

XAMPP kullanıyorsanız:

1. MySQL servisini başlatın (`http://localhost/phpmyadmin`)
2. Veritabanını oluşturun ve SQL dosyasını çalıştırın
3. Backend servisini başlatın: `go run main.go`

### Docker ile Çalıştırma

Docker kullanıyorsanız:

1. `docker-compose up -d` komutuyla her şeyi başlatın
2. Backend servisi port 8080'de çalışacaktır
3. MySQL servisi port 3306'da çalışacaktır

---

## 📚 Kaynaklar

- **Proje PDF:** `../proje.pdf` (75.2 KB)
- **Talimatlar:** `../CLAUDE.md`
- **Gereksinimler:** `../PROJECT_NOTES.md`
- **Web Frontend API:** `../web/README.md`
- **Mobil Uygulama:** `../mobile/README.md`

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
