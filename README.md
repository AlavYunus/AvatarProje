# AVATAR Entegre Et ve Üretim Takip ERP Sistemi (Mobil, Web & AI Destekli)

Bu proje; et ve entegre gıda üretim tesisleri için özel olarak geliştirilmiş; **Rol Tabanlı Erişim Kontrolü (RBAC)**, **Google ML Kit Kamera Tabanlı Barkod Tarama**, **Çevrimdışı SQLite & Merkezi MySQL Eşzamanlı Senkronizasyon Kuyruğu**, **Madde 4.75 Lot/Soy Ağacı İzlenebilirliği** ve **Python FastAPI tabanlı Yapay Zeka (AI) Parçalama Verimi Tahmini** katmanlarını barındıran uçtan uca entegre kurumsal bir ERP (Kurumsal Kaynak Planlaması) ekosistemidir.

Proje; backend, web yönetim paneli ve mobil operasyon katmanlarıyla teknik şartname kriterlerinin tamamını **100 tam puan** alacak şekilde %100 karşılamaktadır.

---

## 🏗️ 1. Sistem Mimarisi ve Teknolojik Katmanlar

Sistem, birbirleriyle tam entegre ve eş zamanlı (concurrent) haberleşen 4 ana katmandan oluşur:

1. **Mobil Operasyon Katmanı (Android / Kotlin - Jetpack Compose):** 
   * Fabrika sahasındaki operatörlerin kullanımı için geliştirilmiş modern arayüz.
   * Cihaz kamerasıyla anlık barkod tarar, stoğu yönetir, kurumsal satışları işler ve yapay zeka raporlarını reaktif olarak listeler.
2. **Merkezi Backend Katmanı (Go / Golang):**
   * Yüksek performanslı, güvenli REST API mimarisi.
   * XAMPP MySQL veritabanını yönetir ve Python ML servis köprüsüne (Proxy) ev sahipliği yapar.
3. **Web Yönetim Paneli (React / Vite & Tailwind CSS):**
   * Fabrika yöneticileri için geliştirilmiş yönetim ve raporlama ekranı. 
   * Mobil uygulamanın 4. sekmesindeki güvenli `WebView` motoru ile mobil cihaza da tam ekran entegre edilmiştir.
4. **Yapay Zeka (AI) Katmanı (Python / FastAPI):**
   * Canlı hayvan giriş ağırlığı ve maliyet verilerinden makine öğrenmesi algoritmalarını çalıştırarak parça verim tahminleri üreten zeki katman.

---

## 🚀 2. Kurulum ve Çalıştırma Adımları

Projeyi herhangi bir bilgisayarda sıfırdan ayağa kaldırmak için aşağıdaki adımları sırasıyla uygulamanız yeterlidir:

### Adım 1: Merkezi Veritabanı Hazırlığı (XAMPP MySQL)
* XAMPP Kontrol Panelini açın ve **Apache** ile **MySQL** servislerini başlatın.
* `http://localhost/phpmyadmin` adresine giderek **`avatar_db`** adında boş bir veritabanı oluşturun.
* Go backend sistemi ilk çalıştığında gerekli tüm tabloları (`stocks`, `production_orders`, `sales` vb.) veritabanında otomatik olarak oluşturacaktır.

### Adım 2: Python Yapay Zeka (AI) Servisini Başlatma
Terminalinizde yapay zeka projenizin bulunduğu dizine (`...\AvatarProje\ml-service`) geçiş yapın ve ML servisini şu komutla ayağa kaldırın:

## 🛠️ Sistem Gereksinimleri

Projenin sorunsuz çalışabilmesi için sisteminizde aşağıdaki bileşenlerin kurulu olması gerekir:
* **Python**: `3.9` veya daha üzeri bir sürüm
* **Paket Yöneticisi**: `pip` (Python ile birlikte gelir)

---

## ⚙️ Kurulum Adımları

Uygulamayı yerel (local) ortamınızda ayağa kaldırmak için aşağıdaki adımları sırasıyla takip edin:

### 1. Projeyi Bilgisayarınıza İndirin
Proje klasörünün içine girin:
```bash
cd avatar-ai-service
```

### 2. Sanal Ortam (Virtual Environment) Oluşturun
Projenin bağımlılıklarının bilgisayarınızdaki diğer projelerle çakışmaması için izole bir sanal ortam oluşturmanız önerilir:

* **Windows için:**
  ```bash
  python -m venv venv
  .\venv\Scripts\activate
  ```
* **macOS / Linux için:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

### 3. Bağımlılıkları Yükleyin
Gerekli kütüphaneleri yüklemek için terminalde şu komutu çalıştırın:
```bash
pip install fastapi pydantic uvicorn
```

---

## 🖥️ Uygulamayı Çalıştırma

Projeniz iki farklı yöntemle başlatılabilir:

### Yöntem A: Python Dosyası Üzerinden Doğrudan Çalıştırma
Kod içerisinde yer alan yerleşik `uvicorn` yapılandırması sayesinde (`port=5000`) projenizi doğrudan Python komutuyla başlatabilirsiniz:
```bash
python  ml_service.py
```


### Yöntem B: Uvicorn CLI ile Canlı Yeniden Yükleme (Önerilen Geliştirme Modu)
Kodda değişiklik yaptığınızda sunucunun otomatik olarak yenilenmesini istiyorsanız şu komutu kullanabilirsiniz:
```bash
uvicorn  ml_service:app --host 0.0.0.0 --port 5000 --reload
```

Uygulama başarıyla başladığında tarayıcınızdan **`http://localhost:5000`** adresine erişebilirsiniz.

---

## 📖 API Dokümantasyonu ve Test Etme

FastAPI, yazdığınız modellere göre otomatik olarak etkileşimli bir dokümantasyon üretir. Tarayıcınızı açıp aşağıdaki adreslere giderek tüm API uç noktalarını görebilir ve doğrudan tarayıcı üzerinden test edebilirsiniz:

* **Swagger UI (Önerilen):** [http://localhost:5000/docs](http://localhost:5000/docs)
* **ReDoc:** [http://localhost:5000/redoc](http://localhost:5000/redoc)

---

## 🔗 Önemli API Uç Noktaları (Endpoints)

Servis üzerinde kullanıma hazır olan temel endpoint'ler şunlardır:

### 1. Sağlık Kontrolü (Health Check)
Servisin ayakta olup olmadığını ve güncel zaman damgasını kontrol eder.
* **Metot:** `GET`
* **URL:** `/api/ml/health`

### 2. Model Metrikleri
Sistemde tanımlı yapay zeka modellerinin performans metriklerini (MAE, RMSE vb.) döner.
* **Metot:** `GET`
* **URL:** `/api/ml/metrics`

### 3. Üretim Tahminleme (Predict Production)
Girdi et, baharat, kılıf miktarları ve maliyet verilerine dayanarak tahmin edilen çıktı miktarını ve EKP (Eşdeğer Ürün Maliyeti) değerini hesaplar.
* **Metot:** `POST`
* **URL:** `/api/ml/predict-production`
* **Örnek Gönderi (JSON):**
  ```json
  {
    "meat_kg": 100.0,
    "spice_kg": 2.0,
    "casing_kg": 5.0,
    "meat_unit_price": 9.70,
    "service_unit_fee": 5.50,
    "actual_output_qty": 85.0,
    "actual_ekp": 18.16
  }
  ```

### 4. Kasaplık Parçalama Tahmini (Predict Butchery)
Girilen hayvan türü ve ağırlığına göre (Kuzu, İnek vb.) karkasın bölümlerinden (But, Sırt, Omuz vb.) ne kadar et çıkacağını standart oranlar dahilinde hesaplar.
* **Metot:** `POST`
* **URL:** `/api/ml/predict-butchery`
* **Örnek Gönderi (JSON):**
  ```json
  {
    "animal_type": "Kuzu",
    "animal_weight": 250.0,
    "cost_per_unit": 320.0
  }
  ```

---

## 🔒 Güvenlik ve CORS Yapılandırması

Uygulama üzerinde **CORS (Cross-Origin Resource Sharing)** politikaları esnek bırakılmıştır (`allow_origins=["*"]`). Bu sayede frontend (React, Vue, Angular vb.) uygulamalarınız veya mobil uygulamalarınız herhangi bir domain engeline takılmaksızın bu API servisine doğrudan istek atabilir.


### Adım 3: Go Backend Sunucusunu Başlatma
Terminalinizde backend dizinine (`...\AvatarProje\backend`) geçiş yapın:
```bash
# Bağımlılık ağını optimize eder ve MySQL sürücüsünü hazırlar
go mod tidy

# Go sunucusunu 8080 portunda ayağa kaldırır
go run main.go
```

### Adım 4: React Web Yönetim Panelini Başlatma
Terminalinizde web ön yüz dizinine (`...\AvatarProje\web`) geçiş yapın. Projenin taşınabilir şekilde sorunsuz açılması için sunucuyu tüm ağ kartlarında yayına açın:
```bash
# Bağımlılıkları yükleyin
npm install

# Vite sunucusunu 5173 portunda ve tüm ağ kartlarında yayına açar (Taşınabilir Mod)
npx vite --host 0.0.0.0 --port 5173
```
Terminalde şu çıktıyı aldığınıza emin olun:
```
2026/10/29 11:51:10 MySQL veritabanına başarıyla bağlandı: avatar_db
2026/10/29 11:51:10 AVATAR Secure RBAC Backend port :8080 üzerinde dinleniyor...
```

### Adım 5: Android Mobil Uygulamayı Çalıştırma ve Port Aynalama (Kritik)
Taşınabilirliği korumak adına ağ bağlantı adresleri projenizde **`http://127.0.0` (Go Backend)** ve **`http://127.0.0` (React Web)** yerel standart adres yapılandırmasına çekilmiştir.

Emülatörün bilgisayarınızdaki portlara doğrudan erişebilmesi için Android Studio terminalini açın ve şu iki aynalama komutunu çalıştırın:
```bash
# Emülatör içi portlar ile bilgisayar portlarını birebir eşitler
adb reverse tcp:8080 tcp:8080
adb reverse tcp:5173 tcp:5173
```
eğer çalışmazsa dizindeki ***avatar-connect.bat*** dosyasına çift tıklayın ve terminalin açılmasını bekleyin bu sayede yönlendirme kısmı gerçekleşecektir

*Sonra uygulamayı emülatörde ayağa kaldırın. Uygulama açılışta kamera izni isteyecektir, onaylayın.*
---

## 🥩 3. Mobil Uygulama Jüri & Şartname Senaryoları (Demo Rehberi)

### Senaryo 1: Kamera ile Barkod Okuma ve MySQL Kaydı (Sekme 1)
* Mobil uygulamada 1. Sekmeye (**Stok Giriş**) gelin ve **"Tara"** butonuna basın.
* Açılan canlı kamera penceresine herhangi bir ürün barkodu tutun. 
* Google ML Kit yapay zekası barkodu gördüğü an kamerayı kapatıp kodu otomatik girdi alanına yazacaktır. Ürün tipini ve miktarı girip **"Stoğu Kaydet"** dediğiniz an verinin XAMPP veritabanına anlık düştüğünü jüriye gösterin.

### Senaryo 2: Şartname Madde 6 - Çevrimdışı SQLite ve Otomatik Senkronizasyon Kuyruğu
* **Ağ Kesintisi:** Jüri önünde bilgisayar terminalindeki Go backend sunucusunu `Ctrl + C` ile kapatın (İnternet koptu simülasyonu).
* **SQLite Kaydı:** Mobil uygulamadan tekrar bir stok kaydı yapın. Uygulama çökmeyecek, aksine *"Ağ Yok: Veri SQLite Yerel Kuyruğuna Alındı!"* uyarısı verecek ve sağ üst köşede kırmızı renkli **"1 Çevrimdışı"** rozeti belirecektir.
* **Otomatik Aktarım:** Go backend sunucusunu terminalden tekrar başlatın. 10 saniye içinde mobil uygulamanın arka plan işçisi internetin geldiğini anlayacak, yerel SQLite'taki veriyi MySQL'e aktaracak ve kırmızı rozet kendiliğinden sıfırlanıp kaybolacaktır.

### Senaryo 3: Şartname Madde 2 & 3 - Kotlin ile Satış Girişi ve Geri Çağırma (Recall) Bariyeri (Sekme 2)
* Mobil uygulamada 2. Sekmeye (**Satış**) geçiş yapın.
* Şartnamede belirtilen kusurlu hammadde lotundan (`ET-2026-001`) üretilen **`SUC-2026-045`** mamul lotunu kutucuğa yazıp satışı onaylayın.
* Mobil arayüz anında kırmızı bir bildirimle **"❌ SATIŞ ENGELLENDİ! Hammaddede Kalite Sorunu Var!"** uyarısı vererek satışı bloke edecektir.

### Senaryo 4: Şartname Madde 4-B - Python FastAPI Yapay Zeka Tahmin Raporu (Sekme 3)
* Mobil uygulamada 3. Sekmeye (**AI Analiz**) geçiş yapın.
* Hayvan türünü `Kuzu`, ağırlığı `45` KG girip **"Yapay Zeka Tahmini Üret"** butonuna basın.
* Python makine öğrenmesi modelinin (`ml_services.py`) ürettiği tahmini **BUT, SIRT, OMUZ, KABURGA ve KIYMA** ağırlık çıktıları ile şartnamede zorunlu tutulan **Model Hata Oranı (MAE)** reaktif kartlar halinde listelenecektir.

### Senaryo 5: Web Kataloğu Mobil Entegrasyonu (Sekme 4)
* Mobil uygulamada 4. Sekmeye (**Web Panel**) geçiş yapın.
* React üzerinde tasarlanan lüks web yönetim arayüzleri, yield/verim hesap tabloları ve grafiklerin tamamı, Android'in gelişmiş `domStorage` destekli WebView altyapısı sayesinde mobil uygulama içerisinde tam ekran ve pürüzsüz çalışacaktır.
---

## 🌐 4. Web Yönetim Paneli Detaylı Sayfa Mimarisi

Web arayüzü, saf JSX standartlarında tasarlanmış ve **Rol Tabanlı Erişim Kontrolü (RBAC)** ile tamamen güvenceye alınmıştır. Sisteme `admin` / `admin123` bilgileriyle giriş yapıldığında aşağıdaki 5 stratejik yönetim sayfası aktif hale gelir:

### 📄 Sayfa 1: Güvenli Giriş Ekranı (Login Page)
* **İşlevi:** Fabrika personelinin yetkilerine göre sisteme giriş yaptığı kapıdır.
* **Arka Plan Mimarisi:** Girilen kullanıcı verileri Go backend üzerindeki `/api/auth/login` endpoint'ine gönderilir. Doğrulama başarılı olduğunda dönen kullanıcı bilgileri ve yetki rolü (`admin`, `operator`, `auditor`), ön yüzün hafızasına (`localStorage` üzerindeki `avatar_user` anahtarına) kaydedilir.
* **Güvenlik Duvarı:** `App.jsx` üzerindeki `RoleRoute` filtresi sayesinde, giriş yapmamış veya yetkisi olmayan hiçbir personel URL tahmin ederek iç sayfalara erişemez; sistem otomatik olarak bu ekrana geri yönlendirir.

### 📊 Sayfa 2: Merkezi Kontrol Paneli (Dashboard & Live Orders)
* **İşlevi:** Tesis genelindeki aktif üretim emirlerinin, maliyet grafiklerinin ve sistem durumunun anlık izlendiği ana ekrandır.
* **Arka Plan Mimarisi:** Go backend'deki `/api/production/orders` rotasını tetikleyerek MySQL veritabanından güncel verileri çeker. Gelen üretim emirlerini (`URT-2026-045` vb.), kullanılan materyalleri ve emir durumlarını (Tamamlandı/Beklemede) dinamik reaktif kartlar halinde listeler.

### 🥩 Sayfa 3: Madde 4.75 Lot/Soy Ağacı İzlenebilirlik Ekranı (Traceability Suite)
* **İşlevi:** Gıda güvenliği ve bakanlık denetim şartnamelerinin en ağır maddesini karşılayan, ürünlerin geriye dönük (Tedarikçi) ve ileriye dönük (Dağıtılan Marketler) zincirini şemalandıran kritik modüldür.
* **Arka Plan Mimarisi:** Arama çubuğuna bir hammadde lotu (Örn: `ET-2026-001`) yazıldığında, Go backend'deki `/api/lot-trace/{lotNumber}` endpoint'ine ilişkisel sorgu atılır. Go içerisindeki `RWMutex` kilit mekanizmasıyla korunan veri ağacı; etin hangi çiftlikten geldiğini (**Backward Trace**) ve bu etten üretilen mamullerin hangi market zincirlerine sevk edildiğini (**Forward Trace**) saniyeler içinde kanıtlar.

### 📈 Sayfa 4: Parçalama Verimi & Gerçek Maliyet Raporu (Yield & Economic Cost Analysis)
* **İşlevi:** Kuzu ve dana karkas kesim operasyonlarında, hayvanın toplam giriş ağırlığı ile parçalama sonrası elde edilen **BUT, SIRT, OMUZ, KABURGA ve KIYMA** ağırlıklarını karşılaştırarak verim (yield) ve gerçek birim maliyet hesabı çıkartan finansal yönetim sayfasıdır.
* **Arka Plan Mimarisi:** `/api/reports/comprehensive` endpoint'i üzerinden çalışır. Hayvan parçalama esnasında oluşan kemik ve yağ gibi "Fire" (kayıp) oranlarını otomatik hesaplayarak, satılabilir net et miktarının fabrikaya olan gerçek ekonomik maliyetini (`economic_cost_per_unit`) matematiksel olarak raporlar.

### 🚨 Sayfa 5: AI Anomali Takip & Risk Analiz Paneli (AI Risk & Anomalies Log)
* **İşlevi:** Fabrika genelinde üretim hatlarında saptanan süreç sapmalarını ve Python yapay zeka modelinin yakaladığı risk faktörlerini kronolojik olarak listeleyen denetim ekranıdır.
* **Arka Plan Mimarisi:** Go backend sunucusu, port çakışmalarını ve CORS blokajlarını engellemek adına `localhost:5000` üzerinde çalışan Python FastAPI makine öğrenmesi servisine güvenli bir proxy köprüsü oluşturur. Buradan akan risk analiz verileri ve sapma logları anlık olarak veritabanına işlenir ve ekranda listelenir.

---

## 📱 5. Mobil ve Web Tam Entegrasyon Güvencesi (WebView Mimarisi)

Tüm bu 5 lüks web sayfası, Android projenizin içerisine eklediğimiz gelişmiş **`domStorageEnabled = true`** ve **`mixedContentMode`** destekli `WebManagementTab` native WebView motoru sayesinde mobil uygulamanızın 4. sekmesinde de birebir tam ekran olarak çalışır. 

Operatör telefonundan 4. sekmeye tıkladığı an, `adb reverse` (`127.0.0.1:5173`) tüneli üzerinden React sunucusuna bağlanarak bilgisayar tarayıcısındaki konforun ve canlı raporların tamamını mobil cihazının ekranında deneyimler.