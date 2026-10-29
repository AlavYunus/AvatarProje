
-- ============================================================
-- AVATAR BACKEND - TABLOLAR
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS avatar_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_turkish_ci;

USE avatar_db;

-- 1. LOTLAR
CREATE TABLE IF NOT EXISTS lots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lot_number VARCHAR(50) NOT NULL UNIQUE,
    material_type VARCHAR(50) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(10) NOT NULL,
    material_cost DECIMAL(10,2) NOT NULL,
    purchase_date DATETIME NOT NULL,
    expiration_date DATETIME NULL,
    supplier VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_lot_number (lot_number),
    INDEX idx_material_type (material_type),
    INDEX idx_purchase_date (purchase_date)
) ENGINE=InnoDB;

-- 2. ÜRETİM EMİRLERİ
CREATE TABLE IF NOT EXISTS production_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    lot_ids JSON NOT NULL,
    materials JSON NOT NULL,
    expected_output DECIMAL(10,2) NOT NULL,
    actual_output DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    total_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    economic_cost_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_number (order_number),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- 3. ÜRETİMDE KULLANILAN HAMMADDELER
CREATE TABLE IF NOT EXISTS material_lines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lot_id INT NOT NULL,
    order_id INT NOT NULL,
    material_type VARCHAR(50) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (lot_id) REFERENCES lots(id),
    FOREIGN KEY (order_id) REFERENCES production_orders(id),
    INDEX idx_lot_id (lot_id),
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB;

-- 4. MAMUL ÜRÜNLER
CREATE TABLE IF NOT EXISTS finished_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lot_number VARCHAR(50) NOT NULL UNIQUE,
    product_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    production_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_name (product_name)
) ENGINE=InnoDB;

-- 5. MAMUL ÜRÜN LOT DETAYLARI
-- Hatalı "finished_product Lots" adı düzeltildi.
CREATE TABLE IF NOT EXISTS finished_product_lots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    source_lot_id INT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    production_date DATETIME NOT NULL,
    FOREIGN KEY (product_id) REFERENCES finished_products(id),
    FOREIGN KEY (source_lot_id) REFERENCES lots(id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB;

-- 6. PARÇALAMA İŞLEMLERİ
CREATE TABLE IF NOT EXISTS cuts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cut_number VARCHAR(50) NOT NULL UNIQUE,
    animal_id INT NOT NULL,
    animal_type VARCHAR(50) NOT NULL,
    animal_weight DECIMAL(10,2) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    purchase_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cut_number (cut_number),
    INDEX idx_animal_type (animal_type)
) ENGINE=InnoDB;

-- 7. PARÇALAMA ÜRÜNLERİ
CREATE TABLE IF NOT EXISTS cut_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cut_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    yield_percent DECIMAL(5,2) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cut_id) REFERENCES cuts(id),
    INDEX idx_cut_id (cut_id),
    INDEX idx_product_name (product_name)
) ENGINE=InnoDB;

-- 8. SATIŞLAR
CREATE TABLE IF NOT EXISTS sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sale_number VARCHAR(50) NOT NULL UNIQUE,
    lot_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) NOT NULL,
    profit DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lot_id) REFERENCES lots(id),
    INDEX idx_sale_number (sale_number),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- 9. İADELER
CREATE TABLE IF NOT EXISTS returns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    return_number VARCHAR(50) NOT NULL UNIQUE,
    lot_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'blocked',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lot_id) REFERENCES lots(id),
    INDEX idx_return_number (return_number),
    INDEX idx_return_status (status)
) ENGINE=InnoDB;

-- 10. STOK
CREATE TABLE IF NOT EXISTS inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    material_type VARCHAR(50) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    total_value DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_inventory_material (material_type)
) ENGINE=InnoDB;

-- 11. YAPAY ZEKA TAHMİNLERİ
CREATE TABLE IF NOT EXISTS ai_predictions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    prediction_type VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    inputs JSON NOT NULL,
    expected_value DECIMAL(10,2) NOT NULL,
    actual_value DECIMAL(10,2) NOT NULL,
    error DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_prediction_type (prediction_type),
    INDEX idx_model_name (model_name)
) ENGINE=InnoDB;

USE avatar_db;

-- ============================================================
-- A. TEST VERİLERİ: HAMMADDE LOTLARI
-- ============================================================

INSERT INTO lots
(lot_number, material_type, quantity, unit, material_cost, purchase_date, supplier)
VALUES
('ET-2026-001', 'ET', 100.00, 'kg', 9.70, '2026-10-20 10:00:00', 'Tedarikçi A'),
('ET-2026-002', 'ET', 50.00, 'kg', 9.70, '2026-10-21 10:00:00', 'Tedarikçi B'),
('BAHARAT-2026-001', 'BAHARAT', 2.00, 'kg', 24.00, '2026-10-20 11:00:00', 'Tedarikçi C'),
('BIBERLIK-2026-001', 'BIBERLIK', 5.00, 'kg', 11.60, '2026-10-20 12:00:00', 'Tedarikçi D');

-- ============================================================
-- B. ÜRETİM EMRİ
-- Malzeme toplamı: 970 + 48 + 58 = 1.076 TL
-- Hizmet maliyeti dahil edilmemiştir.
-- ============================================================

INSERT INTO production_orders
(order_number, lot_ids, materials, expected_output, actual_output,
 status, total_cost, economic_cost_per_unit)
VALUES
(
    'URT-2026-045',
    JSON_ARRAY(1, 3, 4),
    JSON_ARRAY(
        JSON_OBJECT(
            'lot_id', 1,
            'material_type', 'ET',
            'quantity', 100.00,
            'cost_per_unit', 9.70,
            'total_cost', 970.00
        ),
        JSON_OBJECT(
            'lot_id', 3,
            'material_type', 'BAHARAT',
            'quantity', 2.00,
            'cost_per_unit', 24.00,
            'total_cost', 48.00
        ),
        JSON_OBJECT(
            'lot_id', 4,
            'material_type', 'BIBERLIK',
            'quantity', 5.00,
            'cost_per_unit', 11.60,
            'total_cost', 58.00
        )
    ),
    85.00,
    85.00,
    'completed',
    1076.00,
    ROUND(1076.00 / 85.00, 2)
);

-- Üretim emrinde kullanılan hammaddeleri ilişkilendir.
INSERT INTO material_lines
(lot_id, order_id, material_type, quantity, cost_per_unit, total_cost)
SELECT 1, id, 'ET', 100.00, 9.70, 970.00
FROM production_orders
WHERE order_number = 'URT-2026-045';

INSERT INTO material_lines
(lot_id, order_id, material_type, quantity, cost_per_unit, total_cost)
SELECT 3, id, 'BAHARAT', 2.00, 24.00, 48.00
FROM production_orders
WHERE order_number = 'URT-2026-045';

INSERT INTO material_lines
(lot_id, order_id, material_type, quantity, cost_per_unit, total_cost)
SELECT 4, id, 'BIBERLIK', 5.00, 11.60, 58.00
FROM production_orders
WHERE order_number = 'URT-2026-045';

-- ============================================================
-- C. MAMUL ÜRÜN
-- ============================================================

INSERT INTO finished_products
(lot_number, product_name, quantity, cost_per_unit, total_cost, production_date)
VALUES
('SUC-2026-045', 'Narin Sucuk', 85.00, 12.66, 1076.00, '2026-10-24 10:00:00');

-- Mamul lot detayını oluştur.
INSERT INTO finished_product_lots
(product_id, source_lot_id, quantity, cost_per_unit, total_cost, production_date)
SELECT
    fp.id,
    NULL,
    85.00,
    12.66,
    1076.00,
    '2026-10-24 10:00:00'
FROM finished_products fp
WHERE fp.lot_number = 'SUC-2026-045';

-- ============================================================
-- D. PARÇALAMA İŞLEMİ
-- ============================================================

INSERT INTO cuts
(cut_number, animal_id, animal_type, animal_weight,
 cost_per_unit, total_cost, purchase_date)
VALUES
('CUT-2026-001', 1, 'Kuzu', 25.00, 9.70, 242.50, '2026-10-20 08:00:00');

-- Parça ürünleri cut_id ile doğru parçalama işlemine bağla.
INSERT INTO cut_products
(cut_id, product_name, quantity, yield_percent, cost_per_unit, total_cost)
SELECT c.id, p.product_name, p.quantity, p.yield_percent,
       p.cost_per_unit, p.total_cost
FROM cuts c
JOIN (
    SELECT 'BUT' AS product_name, 8.50 AS quantity, 34.00 AS yield_percent,
           9.70 AS cost_per_unit, 82.45 AS total_cost
    UNION ALL
    SELECT 'SIRT', 9.00, 36.00, 9.70, 87.30
    UNION ALL
    SELECT 'OMUZ', 4.50, 18.00, 9.70, 43.65
    UNION ALL
    SELECT 'KABURGA', 2.00, 8.00, 9.70, 19.40
    UNION ALL
    SELECT 'KIYMA', 1.00, 4.00, 9.70, 9.70
) AS p
WHERE c.cut_number = 'CUT-2026-001';

-- ============================================================
-- E. SATIŞ
-- sale_price alanı birim satış fiyatı olarak kullanılmıştır.
-- ============================================================

INSERT INTO sales
(sale_number, lot_id, product_name, quantity, cost_per_unit,
 total_cost, sale_price, profit, status)
SELECT
    'SAL-2026-001',
    l.id,
    'Narin Sucuk',
    30.00,
    12.66,
    379.80,
    25.00,
    (30.00 * 25.00) - 379.80,
    'completed'
FROM lots l
WHERE l.lot_number = 'ET-2026-001';

-- ============================================================
-- F. EK HAMMADDE LOTLARI
-- ============================================================

INSERT INTO lots
(lot_number, material_type, quantity, unit, material_cost, purchase_date, supplier)
VALUES
('SUCUK-2026-001', 'SUCUK', 50.00, 'kg', 18.16, '2026-10-22 10:00:00', 'Tedarikçi E'),
('BUT-2026-001', 'BUT', 8.50, 'kg', 9.70, '2026-10-23 10:00:00', 'Tedarikçi F'),
('SIRT-2026-001', 'SIRT', 9.00, 'kg', 9.70, '2026-10-23 11:00:00', 'Tedarikçi F');

-- ============================================================
-- G. STOK KAYDI ÖRNEĞİ
-- Stok tablosu otomatik güncellenmediği için ayrıca eklenir.
-- ============================================================

INSERT INTO inventory
(material_type, quantity, cost_per_unit, total_value)
VALUES
('ET', 150.00, 9.70, 1455.00),
('BAHARAT', 2.00, 24.00, 48.00),
('BIBERLIK', 5.00, 11.60, 58.00);

-- ============================================================
-- H. ÜRETİM EMİRLERİ RAPORU
-- ============================================================

SELECT
    po.id,
    po.order_number,
    JSON_LENGTH(po.lot_ids) AS lot_count,
    JSON_LENGTH(po.materials) AS material_count,
    po.expected_output,
    po.actual_output,
    po.status,
    po.total_cost,
    ROUND(po.economic_cost_per_unit, 2) AS ekp,
    po.created_at
FROM production_orders po
ORDER BY po.created_at DESC;

-- ============================================================
-- I. TEK ÜRETİM EMRİ
-- ============================================================

SELECT *
FROM production_orders
WHERE order_number = 'URT-2026-045';

-- ============================================================
-- J. EKP HESAPLAMA
-- ============================================================

SELECT
    order_number,
    total_cost,
    actual_output,
    ROUND(total_cost / NULLIF(actual_output, 0), 2) AS ekp
FROM production_orders
WHERE order_number = 'URT-2026-045';

-- ============================================================
-- K. PARÇALAMA ÜRÜNLERİ RAPORU
-- ============================================================

SELECT
    c.cut_number,
    c.animal_type,
    c.animal_weight,
    cp.product_name,
    cp.quantity,
    cp.yield_percent,
    cp.cost_per_unit,
    cp.total_cost
FROM cuts c
JOIN cut_products cp ON cp.cut_id = c.id
ORDER BY c.created_at DESC, cp.product_name;

-- ============================================================
-- L. SATIŞ RAPORU
-- ============================================================

SELECT
    sale_number,
    product_name,
    quantity,
    cost_per_unit,
    total_cost,
    sale_price,
    profit,
    status,
    created_at
FROM sales
ORDER BY created_at DESC;

-- ============================================================
-- M. STOK RAPORU
-- ============================================================

SELECT
    id,
    material_type,
    quantity,
    cost_per_unit,
    total_value
FROM inventory
ORDER BY material_type;

-- ============================================================
-- N. SORUNLU HAMMADDE LOTUNDAN ETKİLENEN ÜRETİMLER
-- ============================================================

SELECT
    l.lot_number,
    l.material_type,
    ml.quantity AS used_quantity,
    po.order_number,
    fp.lot_number AS finished_lot_number,
    fp.product_name,
    fp.quantity AS finished_quantity,
    fp.cost_per_unit AS ekp
FROM lots l
JOIN material_lines ml ON ml.lot_id = l.id
JOIN production_orders po ON po.id = ml.order_id
JOIN finished_product_lots fpl ON fpl.source_lot_id = l.id
JOIN finished_products fp ON fp.id = fpl.product_id
WHERE l.lot_number = 'ET-2026-001';

-- ============================================================
-- O. TÜM MAMUL ÜRÜNLER
-- ============================================================

SELECT
    id,
    lot_number,
    product_name,
    quantity,
    cost_per_unit,
    total_cost,
    production_date
FROM finished_products
ORDER BY production_date DESC;

-- ============================================================
-- P. AI TAHMİN ÖRNEĞİ
-- ============================================================

INSERT INTO ai_predictions
(prediction_type, model_name, inputs, expected_value, actual_value, error)
VALUES
(
    'production_yield',
    'example-model',
    JSON_OBJECT('input_weight', 100, 'expected_yield_percent', 85),
    85.00,
    85.00,
    0.00
);

-- ============================================================
-- Q. İADE KAYDI ÖRNEĞİ
-- ============================================================

INSERT INTO returns
(return_number, lot_id, product_name, quantity, cost_per_unit, total_cost, status)
SELECT
    'RET-2026-001',
    l.id,
    'Narin Sucuk',
    1.00,
    12.66,
    12.66,
    'blocked'
FROM lots l
WHERE l.lot_number = 'ET-2026-001';

-- ============================================================
-- R. İADELERİ LİSTELE
-- ============================================================

SELECT
    r.return_number,
    l.lot_number,
    r.product_name,
    r.quantity,
    r.total_cost,
    r.status,
    r.created_at
FROM returns r
JOIN lots l ON l.id = r.lot_id
ORDER BY r.created_at DESC;


-- ============================================================
-- DOKÜMANTASYON NOTLARI
-- ============================================================

/*
1. EKP (Gerçek Maliyet Hesaplama) Formülü:
   EKP = (Hammadde Maliyeti + Hizmet Maliyeti) / Mamul Miktarı

   Örnek hesaplama:
   - Et: 100 kg × 9.70 TL = 970.00 TL
   - Baharat: 2 kg × 24.00 TL = 48.00 TL
   - Biberlik: 5 kg × 11.60 TL = 58.00 TL
   - Hizmet: 85 paket × 5.50 TL = 467.50 TL
   - Toplam: 1,543.50 TL
   - EKP: 1,543.50 / 85 = 18.16 TL/paket

2. Lot İzlenebilirliği Prensipleri:
   - Her hammadde girişine tedarikçi, parti/lot numarası, tarih, miktar ve son tüketim tarihi atanır
   - Bir üretim emrinde birden fazla hammadde lotu kullanılabilir
   - Bir hammadde lotu birden fazla mamul lote dönülebilir (çoktan-başa ilikiler)
   - Parçalama işlemlerinde giriş lotundan oluşan tüm parça ürün lotlarına izlenebilir denge kurulur

3. Geri İade Prensipleri:
   - Sorunlu hammadde lotundan etkilenen tüm mamul lotlar, stoklar, sevkiyatlar ve alıcılar listelenir
   - Bir mamul lotundan kullanılan hammadde lotları, tedarikçilere ve üretim emirlerine izlenebilir
   - Geri iade ekranı etkilenen ürünleri bloke eder
   - İkinci dereye parçalama yalnızca kaydedilirse kesin olarak gösterilir

4. Yapay Zeka Prensipleri:
   - Lot izlenebilirliği ve geri iade sonuçları KI tahminine değil, kesin kayıt ilikilerine dayanmalıdır
   - Tahmin hata ölçümü sunulmalı
   - Gerçek veri azsa sınırlılıklar açıkça belirtilmelidir
   - AI özellikleri öneri (fatura/irsaliye okuma) ve uyarı (anomali tespiti) amaçlıdır

5. Veri Tutarlılık Kontrolü:
   - Görseldeki tutarsızlık: 25 kg × 11,50 = 287,50 TL gösteriliyor
   - Ancak toplam tutar: 351,00 TL ve alt parça toplamı: 22 kg
   - Bu tutarsızlık tespit edilmeli ve açıklanmalıdır

6. API Entegrasyonu:
   - Backend servisi MySQL veritabanına bağlanarak işlemleri gerçekleştirebilir
   - Her API endpoint'i ilgili SQL sorgularını çalıştırabilir
   - Veritabanı modelleri GORM ile tanımlanmıştır
*/
